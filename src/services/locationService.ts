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
      } catch {
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
  }

  async getLocationProviderStatus(): Promise<{
    locationServicesEnabled: boolean;
    permissionStatus: string;
    accuracy: string;
  }> {
    try {
      const servicesEnabled = await this.checkLocationServicesEnabled();
      const permission = await this.hasLocationPermission();
      
      return {
        locationServicesEnabled: servicesEnabled,
        permissionStatus: permission ? 'GRANTED' : 'DENIED',
        accuracy: 'HIGH',
      };
    } catch {
      return {
        locationServicesEnabled: false,
        permissionStatus: 'UNKNOWN',
        accuracy: 'UNKNOWN',
      };
    }
  }

  private trackingSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;
  private trackingCallback?: (location: { 
    latitude: number; 
    longitude: number; 
    accuracy?: number;
    speed?: number;
    heading?: number;
    timestamp: Date;
  }) => void;

  startTracking(
    callback: (location: { 
      latitude: number; 
      longitude: number; 
      accuracy?: number;
      speed?: number;
      heading?: number;
      timestamp: Date;
    }) => void,
    options: {
      accuracy?: Location.Accuracy;
      timeInterval?: number;
      distanceInterval?: number;
    } = {}
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        if (this.isTracking) {
          this.stopTracking();
        }

        const hasPermission = await this.hasLocationPermission();
        if (!hasPermission) {
          const granted = await this.requestLocationPermission();
          if (!granted) {
            resolve(false);
            return;
          }
        }

        this.trackingCallback = callback;
        this.isTracking = true;

        this.trackingSubscription = await Location.watchPositionAsync(
          {
            accuracy: options.accuracy || Location.Accuracy.Balanced,
            timeInterval: options.timeInterval || 5000,
            distanceInterval: options.distanceInterval || 5,
          },
          (location) => {
            if (this.isTracking && this.trackingCallback) {
              const coords = location.coords;
              this.trackingCallback({
                latitude: coords.latitude,
                longitude: coords.longitude,
                accuracy: coords.accuracy || undefined,
                speed: coords.speed || undefined,
                heading: coords.heading || undefined,
                timestamp: new Date(location.timestamp),
              });
            }
          }
        );

        resolve(true);
      } catch (error) {
        console.error('Failed to start tracking:', error);
        this.isTracking = false;
        resolve(false);
      }
    });
  }

  stopTracking(): void {
    if (this.trackingSubscription) {
      this.trackingSubscription.remove();
      this.trackingSubscription = null;
    }
    this.isTracking = false;
    this.trackingCallback = undefined;
  }

  getTrackingStatus(): boolean {
    return this.isTracking;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  calculatePolygonArea(coordinates: { latitude: number; longitude: number }[]): number {
    if (coordinates.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i].longitude * coordinates[j].latitude;
      area -= coordinates[j].longitude * coordinates[i].latitude;
    }
    area = Math.abs(area) / 2;

    const R = 6371e3;
    const lat1 = coordinates[0].latitude * (Math.PI / 180);
    const lat2 = coordinates[Math.floor(coordinates.length / 2)].latitude * (Math.PI / 180);
    const cosLat = Math.cos((lat1 + lat2) / 2);
    
    return area * R * R * cosLat * cosLat;
  }
}