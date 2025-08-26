import { MAP_CONSTANTS } from '@/src/config/mapConstants';
import { MapFilters, MapLocation, MapViewport, Territory } from '@/src/types/domain';
import { MapRepository } from '@/src/types/repositories';

export class MockMapRepository implements MapRepository {
  private mockLocations: MapLocation[] = [
    {
      id: '1',
      latitude: 37.7749,
      longitude: -122.4194,
      title: 'Golden Gate Bridge',
      description: 'Iconic suspension bridge in San Francisco',
      type: 'point_of_interest',
      metadata: { category: 'landmark' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      latitude: 37.8199,
      longitude: -122.4783,
      title: 'Alcatraz Island',
      description: 'Former federal prison and current tourist attraction',
      type: 'point_of_interest',
      metadata: { category: 'historical' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '3',
      latitude: 37.7858,
      longitude: -122.4064,
      title: 'Fisherman\'s Wharf',
      description: 'Popular tourist area with seafood restaurants',
      type: 'point_of_interest',
      metadata: { category: 'entertainment' },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  private mockTerritories: Territory[] = [
    {
      id: '1',
      name: 'Downtown San Francisco',
      description: 'Central business district and tourist area',
      boundaries: [
        {
          id: 'boundary-1',
          latitude: 37.7890,
          longitude: -122.4000,
          title: 'North Boundary',
          type: 'boundary',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: 'boundary-2',
          latitude: 37.7800,
          longitude: -122.4100,
          title: 'South Boundary',
          type: 'boundary',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      center: {
        latitude: 37.7845,
        longitude: -122.4050,
      },
      area: 2500000, 
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'North Beach',
      description: 'Italian neighborhood known for restaurants and cafes',
      boundaries: [
        {
          id: 'boundary-3',
          latitude: 37.8000,
          longitude: -122.4100,
          title: 'North Boundary',
          type: 'boundary',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ],
      center: {
        latitude: 37.8000,
        longitude: -122.4100,
      },
      area: 800000, 
      status: 'active',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ];

  private currentViewport: MapViewport = MAP_CONSTANTS.DEFAULT_VIEWPORT;

  async getMapLocations(filters: MapFilters): Promise<MapLocation[]> {
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.mockLocations.filter(location => {
      if (location.type === 'territory' && !filters.showTerritories) return false;
      if (location.type === 'point_of_interest' && !filters.showPointsOfInterest) return false;
      if (location.type === 'boundary' && !filters.showBoundaries) return false;
      return true;
    });
  }

  async getTerritories(filters: MapFilters): Promise<Territory[]> {
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return this.mockTerritories.filter(territory => {
      if (!filters.showTerritories) return false;
      if (filters.territoryStatus && !filters.territoryStatus.includes(territory.status)) {
        return false;
      }
      return true;
    });
  }

  async saveMapLocation(location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<MapLocation> {
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newLocation: MapLocation = {
      ...location,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.mockLocations.push(newLocation);
    return newLocation;
  }

  async updateMapLocation(id: string, updates: Partial<MapLocation>): Promise<MapLocation> {
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.mockLocations.findIndex(loc => loc.id === id);
    if (index === -1) {
      throw new Error('Location not found');
    }
    
    const updatedLocation: MapLocation = {
      ...this.mockLocations[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    this.mockLocations[index] = updatedLocation;
    return updatedLocation;
  }

  async deleteMapLocation(id: string): Promise<void> {
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.mockLocations.findIndex(loc => loc.id === id);
    if (index === -1) {
      throw new Error('Location not found');
    }
    
    this.mockLocations.splice(index, 1);
  }

  async getMapViewport(): Promise<MapViewport> {
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return this.currentViewport;
  }

  async saveMapViewport(viewport: MapViewport): Promise<void> {
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.currentViewport = viewport;
  }
}