import { LocationService as ILocationService } from '@/src/types/repositories';
import * as Location from 'expo-location';

export class LocationService implements ILocationService {
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
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 10,
      });

      const coords = location.coords;
      
      if (coords.accuracy && coords.accuracy > 100) {
        const retryLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15000,
          distanceInterval: 15,
        });

        const retryCoords = retryLocation.coords;
        
        return {
          latitude: retryCoords.latitude,
          longitude: retryCoords.longitude,
        };
      }

      return {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
    } catch (error) {
      try {
        const lastKnownLocation = await Location.getLastKnownPositionAsync();
        
        if (lastKnownLocation) {
          const coords = lastKnownLocation.coords;
          return {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
        }
      } catch (fallbackError) {
        // Fallback failed, throw original error
      }
      
      throw new Error(`Failed to get current location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async hasLocationPermission(): Promise<boolean> {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  }

  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === Location.PermissionStatus.GRANTED;
    return granted;
  }

  async checkLocationServicesEnabled(): Promise<boolean> {
    const isEnabled = await Location.hasServicesEnabledAsync();
    return isEnabled;
  }

  watchLocation(callback: (location: { latitude: number; longitude: number }) => void): () => void {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      try {
        if (subscription) {
          subscription.remove();
        }

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const coords = location.coords;
            callback({
              latitude: coords.latitude,
              longitude: coords.longitude,
            });
          }
        );
      } catch (error) {
        console.error('Failed to start location watching:', error);
      }
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }
    };
  }

  cleanup(): void {
    // Cleanup is handled by the return function from watchLocation
  }

  async getLocationProviderStatus(): Promise<{
    locationServicesEnabled: boolean;
    permissionStatus: string;
    accuracy: string;
  }> {
    try {
      const [servicesEnabled, permission] = await Promise.all([
        this.checkLocationServicesEnabled(),
        Location.getForegroundPermissionsAsync(),
      ]);

      return {
        locationServicesEnabled: servicesEnabled,
        permissionStatus: permission.status,
        accuracy: 'High',
      };
    } catch (error) {
      console.error('Failed to get provider status:', error);
      return {
        locationServicesEnabled: false,
        permissionStatus: 'unknown',
        accuracy: 'unknown',
      };
    }
  }
}
