import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { ParticleEffect } from '../../../src/components/game/ParticleEffect';
import { PlayerStatsCard } from '../../../src/components/game/PlayerStatsCard';
import { TerritoryCircle } from '../../../src/components/game/TerritoryCircle';
import { UrinateButton } from '../../../src/components/game/UrinateButton';
import { CARTOON_COLORS, CARTOON_MAP_STYLE } from '../../../src/config/mapStyles';
import { useGameStore } from '../../../src/stores/gameStore';

// Dimensions available if needed for responsive design
// const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { territories, player, markTerritory } = useGameStore();
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  // Animation values
  const statsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Import enhanced cartoon map style
  const customMapStyle = CARTOON_MAP_STYLE;

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to mark territory');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location);
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    } catch {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleMarkTerritory = useCallback(async () => {
    if (!userLocation) {
      Alert.alert('No Location', 'Please wait while we get your location');
      return;
    }

    const success = markTerritory(
      userLocation.coords.latitude,
      userLocation.coords.longitude
    );

    if (success) {
      // Success animation
      buttonScale.value = withSequence(
        withSpring(1.2, { duration: 200 }),
        withSpring(0.8, { duration: 200 }),
        withSpring(1, { duration: 300 })
      );
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Show particle effect
      setShowParticles(true);
      
      // Show brief success message
      setTimeout(() => {
        Alert.alert('🎉 Territory Marked!', 'You successfully marked your territory!', [
          { text: 'Woof!', style: 'default' }
        ]);
      }, 500);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        '😞 Out of Ammo!', 
        'You\'ve used all your daily territory marks. Play minigames to get more!',
        [{ text: 'OK', style: 'default' }]
      );
    }
  }, [userLocation, markTerritory, buttonScale]);

  const toggleStats = () => {
    setShowStats(!showStats);
    statsOpacity.value = withSpring(showStats ? 0 : 1);
  };

  const animatedStatsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: statsOpacity.value === 0 ? -50 : 0 }],
  }));

  const remainingUrinations = player.maxDailyUrinations - player.dailyUrinations;

  // Memoize territory circles to prevent unnecessary re-renders
  const territoryCircles = useMemo(() => 
    territories.map((territory) => (
      <TerritoryCircle
        key={territory.id}
        territory={territory}
        opacity={0.45} // Slightly more visible for cartoon effect
      />
    )), [territories]
  );

  if (!initialRegion) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[CARTOON_COLORS.ui.info, CARTOON_COLORS.ui.primary, CARTOON_COLORS.ui.secondary]}
          style={styles.loadingGradient}
        >
          <Text style={styles.loadingText}>🐕 Finding your location...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapType="mutedStandard"
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
      >
        {/* Render all territories */}
        {territoryCircles}
      </MapView>

      {/* Stats overlay */}
      {showStats && (
        <Animated.View style={[styles.statsOverlay, animatedStatsStyle]} pointerEvents="box-none">
          <PlayerStatsCard stats={player} />
        </Animated.View>
      )}

      {/* Urinate Button */}
      <UrinateButton
        onPress={handleMarkTerritory}
        disabled={remainingUrinations <= 0}
        remainingUrinations={remainingUrinations}
      />

      {/* Stats Toggle Button - Enhanced Cartoon Style */}
      <View style={styles.topButtons} pointerEvents="box-none">
        <SafeAreaView pointerEvents="box-none">
          <View style={styles.buttonContainer} pointerEvents="box-none">
            <TouchableOpacity 
              style={[styles.statsButton, styles.cartoonButton]} 
              onPress={toggleStats}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[CARTOON_COLORS.ui.info, CARTOON_COLORS.ui.primary]}
                style={styles.statsButtonGradient}
              >
                <Text style={styles.statsButtonText}>📊</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Particle Effect */}
      <ParticleEffect
        visible={showParticles}
        type="success"
        onComplete={() => setShowParticles(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CARTOON_COLORS.ui.background,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: CARTOON_COLORS.ui.background,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  map: {
    flex: 1,
  },
  statsOverlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  topButtons: {
    position: 'absolute',
    top: 0,
    right: 16,
    zIndex: 1000,
  },
  buttonContainer: {
    marginTop: 16,
  },
  statsButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: CARTOON_COLORS.ui.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cartoonButton: {
    borderWidth: 3,
    borderColor: CARTOON_COLORS.ui.background,
  },
  statsButtonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: 22,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
