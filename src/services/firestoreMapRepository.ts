import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { MapRepository } from '@/src/types/repositories';
import firestore from '@react-native-firebase/firestore';

export class FirestoreMapRepository implements MapRepository {
  private firestore: typeof firestore;

  constructor() {
    this.firestore = firestore;
  }

  async getMapLocations(filters: MapFilters): Promise<MapLocation[]> {
    try {
      // Return empty array - we're focusing on territories only
      // In the future, you can implement location loading from Firestore
      console.log('📍 Loading map locations: 0 (focusing on territories)');
      return [];
    } catch (error) {
      console.error('Failed to load map locations:', error);
      return [];
    }
  }

  async getTerritories(filters: MapFilters): Promise<Territory[]> {
    try {
      const snapshot = await this.firestore()
        .collection('territories')
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .get();

      const territories: Territory[] = snapshot.docs.map(doc => {
        const data = doc.data();
        
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          boundaries: data.boundaries || [],
          center: data.center,
          area: data.area || 0,
          status: data.status || 'active',
          assignedTo: data.assignedTo,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Territory;
      });

      return territories.filter(territory => {
        if (!filters.showTerritories) return false;
        if (filters.territoryStatus && !filters.territoryStatus.includes(territory.status)) {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error('Failed to load territories:', error);
      return [];
    }
  }

  async saveMapLocation(location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<MapLocation> {
    try {
      const now = firestore.Timestamp.now();
      const newLocation: MapLocation = {
        ...location,
        id: `location_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      await this.firestore()
        .collection('locations')
        .doc(newLocation.id)
        .set(newLocation);

      return newLocation;
    } catch (error) {
      console.error('Failed to save map location:', error);
      throw new Error('Failed to save location');
    }
  }

  async updateMapLocation(id: string, updates: Partial<MapLocation>): Promise<MapLocation> {
    try {
      const now = firestore.Timestamp.now();
      const updateData = {
        ...updates,
        updatedAt: now.toDate(),
      };

      await this.firestore()
        .collection('locations')
        .doc(id)
        .update(updateData);

      // Get the updated document
      const doc = await this.firestore()
        .collection('locations')
        .doc(id)
        .get();

      if (!doc.exists) {
        throw new Error('Location not found');
      }

      return doc.data() as MapLocation;
    } catch (error) {
      console.error('Failed to update map location:', error);
      throw new Error('Failed to update location');
    }
  }

  async deleteMapLocation(id: string): Promise<void> {
    try {
      await this.firestore()
        .collection('locations')
        .doc(id)
        .delete();
    } catch (error) {
      console.error('Failed to delete map location:', error);
      throw new Error('Failed to delete location');
    }
  }

  async getMapViewport(): Promise<MapViewport> {
    try {
      const doc = await this.firestore()
        .collection('settings')
        .doc('viewport')
        .get();

      if (doc.exists) {
        const data = doc.data();
        return {
          latitude: data?.latitude || MAP_CONSTANTS.DEFAULT_VIEWPORT.latitude,
          longitude: data?.longitude || MAP_CONSTANTS.DEFAULT_VIEWPORT.longitude,
          latitudeDelta: data?.latitudeDelta || MAP_CONSTANTS.DEFAULT_VIEWPORT.latitudeDelta,
          longitudeDelta: data?.longitudeDelta || MAP_CONSTANTS.DEFAULT_VIEWPORT.longitudeDelta,
        };
      }

      return MAP_CONSTANTS.DEFAULT_VIEWPORT;
    } catch (error) {
      console.error('Failed to get map viewport:', error);
      return MAP_CONSTANTS.DEFAULT_VIEWPORT;
    }
  }

  async saveMapViewport(viewport: MapViewport): Promise<void> {
    try {
      await this.firestore()
        .collection('settings')
        .doc('viewport')
        .set(viewport);
    } catch (error) {
      console.error('Failed to save map viewport:', error);
      // Don't throw error for viewport save failures
    }
  }
}
