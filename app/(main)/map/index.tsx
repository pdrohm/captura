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
import { CARTOON_COLORS, SIMPLE_GAME_MAP_STYLE } from '../../../src/config/mapStyles';
import { useFirestoreGame } from '../../../src/hooks/useFirestoreGame';
import { useGameStore } from '../../../src/stores/gameStore';

// Dimensions available if needed for responsive design
// const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const { territories, player } = useGameStore();
  const { 
    markTerritory, 
    isLoading, 
    error, 
    isInitialized 
  } = useFirestoreGame();
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  
  // Animation values
  const statsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Game-inspired map style
  const customMapStyle = SIMPLE_GAME_MAP_STYLE;
  

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

    const success = await markTerritory(
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
  const territoryCircles = useMemo(() => {
    // Deduplicate territories by ID to prevent duplicate keys
    const uniqueTerritories = territories.reduce((acc, territory) => {
      if (!acc.find(t => t.id === territory.id)) {
        acc.push(territory);
      }
      return acc;
    }, [] as typeof territories);

    return uniqueTerritories.map((territory) => {
      // Handle createdAt which might be a Date or Firestore timestamp
      let createdAtTime: number;
      if (territory.createdAt) {
        if (territory.createdAt instanceof Date) {
          createdAtTime = territory.createdAt.getTime();
        } else if (typeof territory.createdAt === 'object' && 'toDate' in territory.createdAt) {
          // Firestore timestamp
          createdAtTime = (territory.createdAt as any).toDate().getTime();
        } else {
          createdAtTime = Date.now();
        }
      } else {
        createdAtTime = Date.now();
      }

      return (
        <TerritoryCircle
          key={`territory-${territory.id}-${createdAtTime}`}
          territory={territory}
          opacity={0.8} // Very visible for maximum game impact
        />
      );
    });
  }, [territories]);

  if (!initialRegion || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[CARTOON_COLORS.ui.secondary, CARTOON_COLORS.ui.primary, CARTOON_COLORS.ui.success]}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <Text style={styles.loadingEmoji}>🐕‍🦺</Text>
            <Text style={styles.loadingText}>
              {!initialRegion ? 'Finding your territory...' : 'Connecting to multiplayer...'}
            </Text>
            <Text style={styles.loadingSubtext}>
              {!initialRegion ? 'Get ready to mark your spot!' : 'Loading game data...'}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Game-style background overlay */}
      <View style={styles.mapOverlay} pointerEvents="none" />
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
        mapType="standard"
        showsCompass={false}
        showsScale={false}
        showsBuildings={false}
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        
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

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Urinate Button */}
      <UrinateButton
        onPress={handleMarkTerritory}
        disabled={remainingUrinations <= 0 || isLoading}
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
                colors={[CARTOON_COLORS.ui.secondary, CARTOON_COLORS.ui.primary]}
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
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '800',
    color: CARTOON_COLORS.ui.background,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: CARTOON_COLORS.ui.background,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    opacity: 0.9,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 144, 226, 0.1)', // Subtle blue tint like Pokémon GO
    zIndex: 1,
    pointerEvents: 'none',
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
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    backgroundColor: CARTOON_COLORS.ui.error,
    padding: 12,
    borderRadius: 8,
    zIndex: 1001,
  },
  errorText: {
    color: CARTOON_COLORS.ui.background,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
