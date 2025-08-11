import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { MapRepository } from '@/src/types/repositories';

export interface MapUseCases {
  loadMapData(filters: MapFilters): Promise<{
    locations: MapLocation[];
    territories: Territory[];
  }>;
  saveLocation(location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<MapLocation>;
  updateLocation(id: string, updates: Partial<MapLocation>): Promise<MapLocation>;
  deleteLocation(id: string): Promise<void>;
  getCurrentViewport(): Promise<MapViewport>;
  saveViewport(viewport: MapViewport): Promise<void>;
  clearViewport(): Promise<void>;
  filterLocationsByType(type: MapLocation['type']): Promise<MapLocation[]>;
  searchLocationsNearby(
    center: { latitude: number; longitude: number },
    radius: number
  ): Promise<MapLocation[]>;
}

export class MapUseCasesImpl implements MapUseCases {
  constructor(private mapRepository: MapRepository) {}

  async loadMapData(filters: MapFilters): Promise<{
    locations: MapLocation[];
    territories: Territory[];
  }> {
    try {
      const [locations, territories] = await Promise.all([
        this.mapRepository.getMapLocations(filters),
        this.mapRepository.getTerritories(filters),
      ]);

      return { locations, territories };
    } catch (error) {
      console.error('Failed to load map data:', error);
      throw new Error('Failed to load map data. Please try again.');
    }
  }

  async saveLocation(location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<MapLocation> {
    try {
      return await this.mapRepository.saveMapLocation(location);
    } catch (error) {
      console.error('Failed to save location:', error);
      throw new Error('Failed to save location. Please try again.');
    }
  }

  async updateLocation(id: string, updates: Partial<MapLocation>): Promise<MapLocation> {
    try {
      return await this.mapRepository.updateMapLocation(id, updates);
    } catch (error) {
      console.error('Failed to update location:', error);
      throw new Error('Failed to update location. Please try again.');
    }
  }

  async deleteLocation(id: string): Promise<void> {
    try {
      await this.mapRepository.deleteMapLocation(id);
    } catch (error) {
      console.error('Failed to delete location:', error);
      throw new Error('Failed to delete location. Please try again.');
    }
  }

  async getCurrentViewport(): Promise<MapViewport> {
    try {
      return await this.mapRepository.getMapViewport();
    } catch (error) {
      console.error('Failed to get viewport:', error);
      // Return reasonable fallback viewport if repository fails
      // This will be overridden by user location when available
      return MAP_CONSTANTS.DEFAULT_VIEWPORT;
    }
  }

  async saveViewport(viewport: MapViewport): Promise<void> {
    try {
      await this.mapRepository.saveMapViewport(viewport);
    } catch (error) {
      console.error('Failed to save viewport:', error);
      // Don't throw error for viewport save failures
    }
  }

  async clearViewport(): Promise<void> {
    try {
      // Since the repository doesn't have a clear method, we'll save a special "cleared" state
      // This will be detected by the hook and treated as a cleared viewport
      const clearedViewport: MapViewport = MAP_CONSTANTS.CLEARED_VIEWPORT;
      await this.mapRepository.saveMapViewport(clearedViewport);
      console.log('Viewport cleared by setting to origin coordinates');
    } catch (error) {
      console.error('Failed to clear viewport:', error);
      // Don't throw error for viewport clear failures
    }
  }

  async filterLocationsByType(type: MapLocation['type']): Promise<MapLocation[]> {
    try {
      const locations = await this.mapRepository.getMapLocations({
        showTerritories: type === 'territory',
        showPointsOfInterest: type === 'point_of_interest',
        showBoundaries: type === 'boundary',
      });

      return locations.filter(location => location.type === type);
    } catch (error) {
      console.error('Failed to filter locations by type:', error);
      return [];
    }
  }

  async searchLocationsNearby(
    center: { latitude: number; longitude: number },
    radius: number
  ): Promise<MapLocation[]> {
    try {
      const locations = await this.mapRepository.getMapLocations({
        showTerritories: true,
        showPointsOfInterest: true,
        showBoundaries: true,
      });

      // Simple distance calculation (in a real app, you'd use a proper geospatial library)
      return locations.filter(location => {
        const distance = this.calculateDistance(
          center.latitude,
          center.longitude,
          location.latitude,
          location.longitude
        );
        return distance <= radius;
      });
    } catch (error) {
      console.error('Failed to search locations nearby:', error);
      return [];
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
