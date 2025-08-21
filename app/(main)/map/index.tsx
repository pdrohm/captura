import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useGameStore } from '../../../src/stores/gameStore';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { territories, player, markTerritory } = useGameStore();
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  // Animation values
  const statsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Custom map style (cartoon-like)
  const customMapStyle = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#4FC3F7' }, { saturation: 80 }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#81C784' }, { saturation: 40 }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#FFB74D' }, { weight: 2 }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'simplified' }],
    },
  ];

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
    } catch (error) {
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
        opacity={0.4}
      />
    )), [territories]
  );

  if (!initialRegion) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#4FC3F7', '#29B6F6', '#0288D1']}
          style={styles.loadingGradient}
        >
          {/* Loading indicator could go here */}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
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
      <View style={styles.urinateButtonContainer} pointerEvents="box-none">
        <UrinateButton
          onPress={handleMarkTerritory}
          disabled={remainingUrinations <= 0}
          remainingUrinations={remainingUrinations}
        />
      </View>

      {/* Stats Toggle Button */}
      <View style={styles.topButtons} pointerEvents="box-none">
        <SafeAreaView pointerEvents="box-none">
          <View style={styles.buttonContainer} pointerEvents="box-none">
            <TouchableOpacity style={styles.statsButton} onPress={toggleStats}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
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
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statsButtonGradient: {
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: 20,
  },
  urinateButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
