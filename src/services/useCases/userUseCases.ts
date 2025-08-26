import { userValidator } from '@/src/services/validation';
import { PaginationOptions, SearchResult, User, UserPreferences } from '@/src/types/domain';
import { IErrorHandler, IUserRepository } from '@/src/types/repositories';
import { IUserUseCases } from '@/src/types/useCases';

export class UserUseCases implements IUserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private errorHandler: IErrorHandler
  ) {}

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  async updateProfile(uid: string, profile: Partial<Pick<User, 'displayName' | 'photoURL'>>): Promise<User> {
    try {
      const validation = userValidator.validatePartial(profile);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const updatedUser = await this.userRepository.updateProfile(uid, profile);
      return updatedUser;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<User> {
    try {
      const validation = userValidator.validatePartial({ preferences } as any);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const updatedUser = await this.userRepository.updatePreferences(uid, preferences);
      return updatedUser;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async deleteAccount(uid: string): Promise<boolean> {
    try {
      if (!uid || uid.trim() === '') {
        throw new Error('User ID is required');
      }

      const result = await this.userRepository.delete(uid);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email || email.trim() === '') {
        throw new Error('Email is required');
      }

      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async findUserById(uid: string): Promise<User | null> {
    try {
      if (!uid || uid.trim() === '') {
        throw new Error('User ID is required');
      }

      const user = await this.userRepository.findById(uid);
      return user;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>> {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      if (pagination.page < 1) {
        throw new Error('Page number must be at least 1');
      }

      if (pagination.limit < 1 || pagination.limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      const result = await this.userRepository.searchUsers(query, pagination);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getCollaborators(territoryId: string): Promise<User[]> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      const collaborators = await this.userRepository.findCollaborators(territoryId);
      return collaborators;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async inviteUserToTerritory(territoryId: string, userEmail: string): Promise<boolean> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userEmail || userEmail.trim() === '') {
        throw new Error('User email is required');
      }

      if (!userEmail.includes('@')) {
        throw new Error('Invalid email format');
      }

      return true;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async removeUserFromTerritory(territoryId: string, userId: string): Promise<boolean> {
    try {
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      return true;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }
}