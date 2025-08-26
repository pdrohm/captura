import * as Haptics from 'expo-haptics';
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
import { Colors, RetroColors } from '../../../src/config/Colors';
import { SIMPLE_GAME_MAP_STYLE } from '../../../src/config/mapStyles';
import { RetroBorders, RetroRadius, RetroShadows, RetroText } from '../../../src/config/retroStyles';
import { useColorScheme } from '../../../src/hooks/useColorScheme';
import { useFirestoreGame } from '../../../src/hooks/useFirestoreGame';
import { useGameStore } from '../../../src/stores/gameStore';

export default function MapScreen() {
  const { territories, player } = useGameStore();
  const { 
    markTerritory, 
    isLoading, 
    error, 
    isInitialized 
  } = useFirestoreGame();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [initialRegion, setInitialRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const statsOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const customMapStyle = SIMPLE_GAME_MAP_STYLE;

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
      
      buttonScale.value = withSequence(
        withSpring(1.2, { duration: 200 }),
        withSpring(0.8, { duration: 200 }),
        withSpring(1, { duration: 300 })
      );
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setShowParticles(true);

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

  const territoryCircles = useMemo(() => {
    
    const uniqueTerritories = territories.reduce((acc, territory) => {
      if (!acc.find(t => t.id === territory.id)) {
        acc.push(territory);
      }
      return acc;
    }, [] as typeof territories);

    return uniqueTerritories.map((territory) => {
      
      let createdAtTime: number;
      if (territory.createdAt) {
        if (territory.createdAt instanceof Date) {
          createdAtTime = territory.createdAt.getTime();
        } else if (typeof territory.createdAt === 'object' && 'toDate' in territory.createdAt) {
          
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
          opacity={0.8} 
        />
      );
    });
  }, [territories]);

  if (!initialRegion || !isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingContent, { backgroundColor: colors.background }]}>
          <View style={[styles.loadingCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[RetroText.gameTitle, { color: colors.text, textAlign: 'center', marginBottom: 16 }]}>🌍 MAP LOADING 🐕</Text>
            <Text style={styles.loadingEmoji}>🐕‍🦺</Text>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              {!initialRegion ? '🗺️ FINDING YOUR TERRITORY...' : '📡 CONNECTING TO DOG NETWORK...'}
            </Text>
            <Text style={[styles.loadingSubtext, { color: colors.textSecondary }]}>
              {!initialRegion ? 'Get ready to mark your spot!' : 'Loading good boy data...'}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
        {territoryCircles}
      </MapView>

      {showStats && (
        <Animated.View style={[styles.statsOverlay, animatedStatsStyle]} pointerEvents="box-none">
          <PlayerStatsCard stats={player} />
        </Animated.View>
      )}

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: RetroColors.collarRed, borderColor: colors.border }]}>
          <Text style={[styles.errorText, { color: colors.background }]}>⚠️ {error}</Text>
        </View>
      )}

      <UrinateButton
        onPress={handleMarkTerritory}
        disabled={remainingUrinations <= 0 || isLoading}
        remainingUrinations={remainingUrinations}
      />

      <View style={styles.topButtons} pointerEvents="box-none">
        <SafeAreaView pointerEvents="box-none">
          <View style={styles.buttonContainer} pointerEvents="box-none">
            <TouchableOpacity 
              style={[styles.statsButton, { backgroundColor: RetroColors.softPurple, borderColor: colors.border }]} 
              onPress={toggleStats}
              activeOpacity={0.8}
            >
              <Text style={[styles.statsButtonText, { color: colors.background }]}>📊</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

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
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingCard: {
    ...RetroBorders.bold,
    borderRadius: RetroRadius.xxl,
    padding: 32,
    alignItems: 'center',
    ...RetroShadows.soft,
    maxWidth: 320,
    width: '100%',
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  loadingText: {
    ...RetroText.heading,
    textAlign: 'center',
    marginBottom: 12,
  },
  loadingSubtext: {
    ...RetroText.body,
    textAlign: 'center',
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
    backgroundColor: 'rgba(74, 144, 226, 0.1)', 
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
    borderRadius: RetroRadius.lg,
    ...RetroBorders.sticker,
    justifyContent: 'center',
    alignItems: 'center',
    ...RetroShadows.soft,
  },
  statsButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: RetroRadius.lg,
    ...RetroBorders.sticker,
    zIndex: 1001,
    ...RetroShadows.soft,
  },
  errorText: {
    ...RetroText.body,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});