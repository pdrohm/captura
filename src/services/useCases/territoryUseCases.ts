import { territoryValidator } from '@/src/services/validation';
import { GeoCoordinates, PaginationOptions, SearchFilters, SearchResult, Territory } from '@/src/types/domain';
import { IErrorHandler, ITerritoryRepository } from '@/src/types/repositories';
import { ITerritoryUseCases } from '@/src/types/useCases';

export class TerritoryUseCases implements ITerritoryUseCases {
  constructor(
    private territoryRepository: ITerritoryRepository,
    private errorHandler: IErrorHandler
  ) {}

  async createTerritory(data: Omit<Territory, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt'>): Promise<Territory> {
    try {
      const validation = territoryValidator.validatePartial(data);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      let territoryData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActivityAt: new Date()
      };

      if (data.assignedTo) {
        try {
          console.log('Territory assigned to user:', data.assignedTo);
        } catch (error) {
          console.warn('Failed to fetch owner information during creation:', error);
        }
      }

      const territory = await this.territoryRepository.create(territoryData);
      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async updateTerritory(id: string, data: Partial<Territory>): Promise<Territory> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Territory ID is required');
      }

      const validation = territoryValidator.validatePartial(data);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      const territory = await this.territoryRepository.update(id, updateData);
      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async deleteTerritory(id: string): Promise<boolean> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Territory ID is required');
      }

      const result = await this.territoryRepository.delete(id);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async claimTerritory(territoryId: string, userId: string): Promise<Territory> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      const territory = await this.territoryRepository.claimTerritory(territoryId, userId);
      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async releaseTerritory(territoryId: string, userId: string): Promise<boolean> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      const result = await this.territoryRepository.releaseTerritory(territoryId, userId);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getTerritoryById(id: string): Promise<Territory | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Territory ID is required');
      }

      const territory = await this.territoryRepository.findById(id);
      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getTerritoryWithOwner(id: string): Promise<Territory | null> {
    try {
      if (!id || id.trim() === '') {
        throw new Error('Territory ID is required');
      }

      const territory = await this.territoryRepository.getTerritoryWithOwner(id);
      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getTerritoriesByOwner(ownerId: string): Promise<Territory[]> {
    try {
      if (!ownerId || ownerId.trim() === '') {
        throw new Error('Owner ID is required');
      }

      const territories = await this.territoryRepository.findByOwner(ownerId);
      return territories;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getTerritoriesByLocation(coordinates: GeoCoordinates, radius: number): Promise<Territory[]> {
    try {
      if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
        throw new Error('Valid coordinates are required');
      }

      if (coordinates.latitude < -90 || coordinates.latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }

      if (coordinates.longitude < -180 || coordinates.longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }

      if (typeof radius !== 'number' || radius <= 0) {
        throw new Error('Radius must be a positive number');
      }

      const territories = await this.territoryRepository.findByLocation(coordinates, radius);
      return territories;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async searchTerritories(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<Territory>> {
    try {
      if (pagination.page < 1) {
        throw new Error('Page number must be at least 1');
      }

      if (pagination.limit < 1 || pagination.limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      if (filters.location) {
        if (filters.location.latitude < -90 || filters.location.latitude > 90) {
          throw new Error('Filter latitude must be between -90 and 90');
        }

        if (filters.location.longitude < -180 || filters.location.longitude > 180) {
          throw new Error('Filter longitude must be between -180 and 180');
        }
      }

      if (filters.radius !== undefined && (filters.radius <= 0 || filters.radius > 50000)) {
        throw new Error('Filter radius must be between 0 and 50,000 meters');
      }

      if (filters.minPoints !== undefined && filters.minPoints < 0) {
        throw new Error('Minimum points cannot be negative');
      }

      if (filters.maxPoints !== undefined && filters.maxPoints < 0) {
        throw new Error('Maximum points cannot be negative');
      }

      if (filters.minPoints !== undefined && filters.maxPoints !== undefined && filters.minPoints > filters.maxPoints) {
        throw new Error('Minimum points cannot be greater than maximum points');
      }

      const result = await this.territoryRepository.searchTerritories(filters, pagination);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async upgradeTerritory(territoryId: string, userId: string): Promise<Territory> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      const territory = await this.territoryRepository.findById(territoryId);
      if (!territory) {
        throw new Error('Territory not found');
      }

      return territory;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async challengeTerritory(territoryId: string, challengerId: string): Promise<boolean> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!challengerId || challengerId.trim() === '') {
        throw new Error('Challenger ID is required');
      }

      return true;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }
}