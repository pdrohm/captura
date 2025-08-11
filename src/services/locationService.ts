import { LocationService } from '@/src/types/repositories';
import * as Location from 'expo-location';

export class ExpoLocationService implements LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    try {
      console.log('🔍 [LocationService] Getting current location...');
      
      const hasPermission = await this.hasLocationPermission();
      if (!hasPermission) {
        console.log('❌ [LocationService] No location permission, requesting...');
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      console.log('✅ [LocationService] Permission granted, getting GPS position...');
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 3,
      });

      console.log('📍 [LocationService] GPS position obtained:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        heading: location.coords.heading,
        speed: location.coords.speed,
        timestamp: new Date(location.timestamp).toISOString(),
      });

      if (location.coords.accuracy && location.coords.accuracy > 50) {
        console.warn('⚠️ [LocationService] GPS accuracy is poor:', location.coords.accuracy, 'meters');
        console.log('🔄 [LocationService] Trying to get better accuracy...');
        
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 8000,
          distanceInterval: 3,
        });
        
        console.log('📍 [LocationService] High accuracy position after retry:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        });
      }

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      if (coords.latitude === 0 && coords.longitude === 0) {
        throw new Error('Invalid coordinates received (0,0)');
      }

      if (Math.abs(coords.latitude) > 90 || Math.abs(coords.longitude) > 180) {
        throw new Error('Coordinates out of valid range');
      }

      const defaultLat = -28.4698;
      const defaultLng = -49.0069;
      const tolerance = 0.001;
      
      if (Math.abs(coords.latitude - defaultLat) < tolerance && 
          Math.abs(coords.longitude - defaultLng) < tolerance) {
        console.warn('⚠️ [LocationService] Coordinates are very close to default Brazil coordinates');
        console.warn('⚠️ [LocationService] This might indicate a fallback to default values');
        console.warn('⚠️ [LocationService] Attempting to get fresh GPS coordinates...');
        
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 3,
        });
        
        coords.latitude = location.coords.latitude;
        coords.longitude = location.coords.longitude;
        
        console.log('📍 [LocationService] Fresh coordinates after retry:', coords);
        
        if (Math.abs(coords.latitude - defaultLat) < tolerance && 
            Math.abs(coords.longitude - defaultLng) < tolerance) {
          throw new Error('Still getting default coordinates after retry. GPS may not be working properly.');
        }
      }

      console.log('✅ [LocationService] Valid device coordinates obtained:', coords);
      return coords;

    } catch (error) {
      console.error('❌ [LocationService] Failed to get current location:', error);
      
      try {
        console.log('🔄 [LocationService] Trying to get last known location...');
        const lastKnownLocation = await Location.getLastKnownPositionAsync({});
        
        if (lastKnownLocation) {
          console.log('📍 [LocationService] Using last known location:', {
            latitude: lastKnownLocation.coords.latitude,
            longitude: lastKnownLocation.coords.longitude,
            timestamp: new Date(lastKnownLocation.timestamp).toISOString(),
          });
          
          return {
            latitude: lastKnownLocation.coords.latitude,
            longitude: lastKnownLocation.coords.longitude,
          };
        }
      } catch (fallbackError) {
        console.warn('⚠️ [LocationService] Failed to get last known location:', fallbackError);
      }
      
      throw new Error(`Failed to get current location: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      console.log('🔐 [LocationService] Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      console.log('🔐 [LocationService] Permission request result:', status, granted ? '✅' : '❌');
      return granted;
    } catch (error) {
      console.error('❌ [LocationService] Failed to request location permission:', error);
      return false;
    }
  }

  async hasLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      const hasPermission = status === 'granted';
      console.log('🔐 [LocationService] Current permission status:', status, hasPermission ? '✅' : '❌');
      return hasPermission;
    } catch (error) {
      console.error('❌ [LocationService] Failed to check location permission:', error);
      return false;
    }
  }

  async checkLocationServicesEnabled(): Promise<boolean> {
    try {
      const isEnabled = await Location.hasServicesEnabledAsync();
      console.log('📍 [LocationService] Location services enabled:', isEnabled ? '✅' : '❌');
      return isEnabled;
    } catch (error) {
      console.error('❌ [LocationService] Failed to check location services:', error);
      return false;
    }
  }

  watchLocation(callback: (location: { latitude: number; longitude: number }) => void): () => void {
    console.log('👀 [LocationService] Starting location watching...');
    
    if (this.locationSubscription) {
      console.log('🧹 [LocationService] Cleaning up existing subscription...');
      this.locationSubscription.remove();
    }

    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 3,
      },
      (location) => {
        console.log('📍 [LocationService] Location update received:', {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
          timestamp: new Date(location.timestamp).toISOString(),
        });
        
        callback({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    ).then((subscription) => {
      this.locationSubscription = subscription;
      console.log('✅ [LocationService] Location watching started successfully');
    }).catch((error) => {
      console.error('❌ [LocationService] Failed to start location watching:', error);
    });

    return () => {
      console.log('🧹 [LocationService] Cleaning up location subscription...');
      if (this.locationSubscription) {
        this.locationSubscription.remove();
        this.locationSubscription = null;
      }
    };
  }

  // Cleanup method to be called when component unmounts
  cleanup(): void {
    console.log('🧹 [LocationService] Cleaning up location service...');
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  // Debug method to get location provider status
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
      console.error('❌ [LocationService] Failed to get provider status:', error);
      return {
        locationServicesEnabled: false,
        permissionStatus: 'unknown',
        accuracy: 'unknown',
      };
    }
  }
}
