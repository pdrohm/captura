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
    // TODO: Get current user from auth context
    // For now, return null as this needs to be integrated with auth
    return null;
  }

  async updateProfile(uid: string, profile: Partial<Pick<User, 'displayName' | 'photoURL'>>): Promise<User> {
    try {
      // Validate input
      const validation = userValidator.validatePartial(profile);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Update profile
      const updatedUser = await this.userRepository.updateProfile(uid, profile);
      return updatedUser;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<User> {
    try {
      // Validate preferences
      const validation = userValidator.validatePartial({ preferences } as any);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Update preferences
      const updatedUser = await this.userRepository.updatePreferences(uid, preferences);
      return updatedUser;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async deleteAccount(uid: string): Promise<boolean> {
    try {
      // Validate uid
      if (!uid || uid.trim() === '') {
        throw new Error('User ID is required');
      }

      // Delete account
      const result = await this.userRepository.delete(uid);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      // Validate email
      if (!email || email.trim() === '') {
        throw new Error('Email is required');
      }

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      return user;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async findUserById(uid: string): Promise<User | null> {
    try {
      // Validate uid
      if (!uid || uid.trim() === '') {
        throw new Error('User ID is required');
      }

      // Find user by ID
      const user = await this.userRepository.findById(uid);
      return user;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>> {
    try {
      // Validate query
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }

      // Validate pagination
      if (pagination.page < 1) {
        throw new Error('Page number must be at least 1');
      }

      if (pagination.limit < 1 || pagination.limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      // Search users
      const result = await this.userRepository.searchUsers(query, pagination);
      return result;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async getCollaborators(territoryId: string): Promise<User[]> {
    try {
      // Validate territory ID
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      // Get collaborators
      const collaborators = await this.userRepository.findCollaborators(territoryId);
      return collaborators;
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async inviteUserToTerritory(territoryId: string, userEmail: string): Promise<boolean> {
    try {
      // Validate inputs
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userEmail || userEmail.trim() === '') {
        throw new Error('User email is required');
      }

      // Validate email format
      if (!userEmail.includes('@')) {
        throw new Error('Invalid email format');
      }

      // TODO: Implement invitation logic
      // This would typically involve:
      // 1. Creating an invitation record
      // 2. Sending notification to the user
      // 3. Updating territory collaboration settings
      
      return true; // Placeholder
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  async removeUserFromTerritory(territoryId: string, userId: string): Promise<boolean> {
    try {
      // Validate inputs
      if (!territoryId || territoryId.trim() === '') {
        throw new Error('Territory ID is required');
      }

      if (!userId || userId.trim() === '') {
        throw new Error('User ID is required');
      }

      // TODO: Implement removal logic
      // This would typically involve:
      // 1. Removing user from territory collaborators
      // 2. Updating territory permissions
      // 3. Notifying the removed user
      
      return true; // Placeholder
    } catch (error) {
      this.errorHandler.handle(error);
      throw error;
    }
  }
}
