import { LocationService } from '@/src/types/repositories';
import * as Location from 'expo-location';

export class ExpoLocationService implements LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    try {
      const hasPermission = await this.hasLocationPermission();
      if (!hasPermission) {
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      throw new Error('Failed to get current location');
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  }

  async hasLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to check location permission:', error);
      return false;
    }
  }

  watchLocation(callback: (location: { latitude: number; longitude: number }) => void): () => void {
    // Clean up any existing subscription
    if (this.locationSubscription) {
      this.locationSubscription.remove();
    }

    // Start watching location
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    ).then((subscription) => {
      this.locationSubscription = subscription;
    });

    // Return cleanup function
    return () => {
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }
    };
  }

  // Cleanup method to be called when component unmounts
  cleanup(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }
}
