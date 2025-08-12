import { ConquestPoint, ConquestSession, ConquestSettings, ConquestStatus } from '@/src/types/domain';
import { LocationService } from '@/src/types/repositories';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface UseConquestModeProps {
  locationService: LocationService;
  userId: string;
}

export const useConquestMode = ({ locationService, userId }: UseConquestModeProps) => {
  const [status, setStatus] = useState<ConquestStatus>('idle');
  const [currentSession, setCurrentSession] = useState<ConquestSession | null>(null);
  const [trackedPoints, setTrackedPoints] = useState<ConquestPoint[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const sessionStartTime = useRef<Date | null>(null);
  const lastPoint = useRef<ConquestPoint | null>(null);
  const settings: ConquestSettings = {
    autoSave: true,
    minDistanceThreshold: 5, // 5 meters
    minTimeThreshold: 3000, // 3 seconds
    accuracyThreshold: 20, // 20 meters
  };

  useEffect(() => {
    return () => {
      if (status === 'tracking') {
        locationService.stopTracking();
      }
    };
  }, [status, locationService]);

  const startConquest = useCallback(async () => {
    try {
      const hasPermission = await locationService.hasLocationPermission();
      if (!hasPermission) {
        const granted = await locationService.requestLocationPermission();
        if (!granted) {
          Alert.alert('Permission Required', 'Location permission is required to start conquest mode.');
          return false;
        }
      }

      const session: ConquestSession = {
        id: `session_${Date.now()}`,
        userId,
        status: 'tracking',
        startTime: new Date(),
        points: [],
        totalDistance: 0,
        totalArea: 0,
        metadata: {},
      };

      setCurrentSession(session);
      setStatus('tracking');
      setTrackedPoints([]);
      setTotalDistance(0);
      setTotalArea(0);
      setIsPaused(false);
      sessionStartTime.current = new Date();

      const success = await locationService.startTracking(
        (location) => {
          handleLocationUpdate(location);
        },
        {
          accuracy: 5,
          timeInterval: 3000,
          distanceInterval: 5,
        }
      );

      if (!success) {
        Alert.alert('Error', 'Failed to start location tracking. Please try again.');
        setStatus('idle');
        setCurrentSession(null);
        return false;
      }

      Alert.alert('Conquest Started!', 'You are now tracking your territory conquest. Move around to create your polygon!');
      return true;
    } catch (error) {
      console.error('Failed to start conquest:', error);
      Alert.alert('Error', 'Failed to start conquest mode. Please try again.');
      return false;
    }
  }, [locationService, userId]);

  const pauseConquest = useCallback(() => {
    if (status === 'tracking') {
      setStatus('paused');
      setIsPaused(true);
      locationService.stopTracking();
      Alert.alert('Conquest Paused', 'Your conquest has been paused. You can resume or complete it.');
    }
  }, [status, locationService]);

  const resumeConquest = useCallback(async () => {
    if (status === 'paused') {
      const success = await locationService.startTracking(
        (location) => {
          handleLocationUpdate(location);
        },
        {
          accuracy: 5,
          timeInterval: 3000,
          distanceInterval: 5,
        }
      );

      if (success) {
        setStatus('tracking');
        setIsPaused(false);
        Alert.alert('Conquest Resumed', 'Your conquest tracking has resumed!');
      } else {
        Alert.alert('Error', 'Failed to resume tracking. Please try again.');
      }
    }
  }, [status, locationService]);

  const stopConquest = useCallback(async () => {
    if (status === 'tracking' || status === 'paused') {
      locationService.stopTracking();
      
      if (trackedPoints.length < 3) {
        Alert.alert(
          'Insufficient Points', 
          'You need at least 3 points to create a territory. Your conquest has been cancelled.',
          [
            { text: 'OK', onPress: () => resetConquest() }
          ]
        );
        return;
      }

      setStatus('completed');
      setIsPaused(false);
      
      Alert.alert(
        'Conquest Complete!', 
        `You've conquered a territory!\n\nTotal Distance: ${(totalDistance / 1000).toFixed(2)} km\nTotal Area: ${(totalArea / 10000).toFixed(2)} hectares`,
        [
          { text: 'Save Territory', onPress: () => saveTerritory() },
          { text: 'Discard', style: 'destructive', onPress: () => resetConquest() }
        ]
      );
    }
  }, [status, locationService, trackedPoints.length, totalDistance, totalArea]);

  const cancelConquest = useCallback(() => {
    if (status === 'tracking' || status === 'paused') {
      locationService.stopTracking();
      resetConquest();
      Alert.alert('Conquest Cancelled', 'Your conquest has been cancelled.');
    }
  }, [status, locationService]);

  const resetConquest = useCallback(() => {
    setStatus('idle');
    setCurrentSession(null);
    setTrackedPoints([]);
    setTotalDistance(0);
    setTotalArea(0);
    setIsPaused(false);
    sessionStartTime.current = null;
    lastPoint.current = null;
    locationService.stopTracking();
  }, [locationService]);

  const handleLocationUpdate = useCallback((location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    timestamp: Date;
  }) => {
    // Check accuracy threshold
    if (location.accuracy && location.accuracy > settings.accuracyThreshold) {
      console.log('Location accuracy too low, skipping point');
      return;
    }

    // Check time threshold
    if (lastPoint.current) {
      const timeDiff = location.timestamp.getTime() - lastPoint.current.timestamp.getTime();
      if (timeDiff < settings.minTimeThreshold) {
        console.log('Time threshold not met, skipping point');
        return;
      }
    }

    // Check distance threshold
    if (lastPoint.current) {
      const distance = locationService.calculateDistance(
        lastPoint.current.latitude,
        lastPoint.current.longitude,
        location.latitude,
        location.longitude
      );
      
      if (distance < settings.minDistanceThreshold) {
        console.log('Distance threshold not met, skipping point');
        return;
      }
    }

    const newPoint: ConquestPoint = {
      id: `point_${Date.now()}`,
      sessionId: currentSession?.id || '',
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
      accuracy: location.accuracy,
      speed: location.speed,
      heading: location.heading,
    };

    setTrackedPoints(prev => {
      const updated = [...prev, newPoint];
      
      // Calculate total distance
      let distance = 0;
      for (let i = 1; i < updated.length; i++) {
        distance += locationService.calculateDistance(
          updated[i - 1].latitude,
          updated[i - 1].longitude,
          updated[i].latitude,
          updated[i].longitude
        );
      }
      setTotalDistance(distance);

      // Calculate area if we have enough points
      if (updated.length >= 3) {
        const coordinates = updated.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }));
        const area = locationService.calculatePolygonArea(coordinates);
        setTotalArea(area);
      }

      return updated;
    });

    lastPoint.current = newPoint;
  }, [currentSession, locationService, settings]);

  const saveTerritory = useCallback(() => {
    if (trackedPoints.length < 3) {
      Alert.alert('Error', 'Not enough points to create a territory.');
      return;
    }

    // Here you would typically save to your repository
    // For now, we'll just show a success message
    Alert.alert(
      'Territory Saved!', 
      `Your conquered territory has been saved!\n\nPoints: ${trackedPoints.length}\nDistance: ${(totalDistance / 1000).toFixed(2)} km\nArea: ${(totalArea / 10000).toFixed(2)} hectares`,
      [
        { text: 'OK', onPress: () => resetConquest() }
      ]
    );
  }, [trackedPoints.length, totalDistance, totalArea]);

  return {
    status,
    currentSession,
    trackedPoints,
    totalDistance,
    totalArea,
    isPaused,
    startConquest,
    pauseConquest,
    resumeConquest,
    stopConquest,
    cancelConquest,
    resetConquest,
    saveTerritory,
  };
};
