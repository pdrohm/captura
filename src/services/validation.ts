import { Territory, User, UserPreferences } from '@/src/types/domain';
import { IValidator } from '@/src/types/repositories';

export class UserValidator implements IValidator<User> {
  validate(data: User): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.uid || data.uid.trim() === '') {
      errors.push('User ID is required');
    }

    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.displayName && data.displayName.trim().length < 2) {
      errors.push('Display name must be at least 2 characters long');
    }

    if (data.photoURL && !this.isValidUrl(data.photoURL)) {
      errors.push('Invalid photo URL format');
    }

    if (!this.isValidDate(data.createdAt)) {
      errors.push('Invalid creation date');
    }

    if (!this.isValidDate(data.lastActiveAt)) {
      errors.push('Invalid last active date');
    }

    if (data.preferences) {
      const preferenceErrors = this.validateUserPreferences(data.preferences);
      errors.push(...preferenceErrors);
    }

    if (data.notificationSettings) {
      const notificationErrors = this.validateNotificationSettings(data.notificationSettings);
      errors.push(...notificationErrors);
    }

    if (data.privacySettings) {
      const privacyErrors = this.validatePrivacySettings(data.privacySettings);
      errors.push(...privacyErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePartial(data: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.email !== undefined) {
      if (!data.email || data.email.trim() === '') {
        errors.push('Email is required');
      } else if (!this.isValidEmail(data.email)) {
        errors.push('Invalid email format');
      }
    }

    if (data.displayName !== undefined && data.displayName) {
      if (data.displayName.trim().length < 2) {
        errors.push('Display name must be at least 2 characters long');
      }
    }

    if (data.photoURL !== undefined && data.photoURL) {
      if (!this.isValidUrl(data.photoURL)) {
        errors.push('Invalid photo URL format');
      }
    }

    if (data.preferences !== undefined && data.preferences) {
      const preferenceErrors = this.validateUserPreferences(data.preferences);
      errors.push(...preferenceErrors);
    }

    if (data.notificationSettings !== undefined && data.notificationSettings) {
      const notificationErrors = this.validateNotificationSettings(data.notificationSettings);
      errors.push(...notificationErrors);
    }

    if (data.privacySettings !== undefined && data.privacySettings) {
      const privacyErrors = this.validatePrivacySettings(data.privacySettings);
      errors.push(...privacyErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateUserPreferences(preferences: UserPreferences): string[] {
    const errors: string[] = [];

    if (!['light', 'dark', 'system'].includes(preferences.theme)) {
      errors.push('Invalid theme value');
    }

    if (!preferences.language || preferences.language.trim() === '') {
      errors.push('Language is required');
    }

    if (!['metric', 'imperial'].includes(preferences.units)) {
      errors.push('Invalid units value');
    }

    return errors;
  }

  private validateNotificationSettings(settings: any): string[] {
    const errors: string[] = [];

    if (typeof settings.pushNotifications !== 'boolean') {
      errors.push('Push notifications setting must be a boolean');
    }

    if (typeof settings.emailNotifications !== 'boolean') {
      errors.push('Email notifications setting must be a boolean');
    }

    if (typeof settings.territoryUpdates !== 'boolean') {
      errors.push('Territory updates setting must be a boolean');
    }

    if (typeof settings.collaborationRequests !== 'boolean') {
      errors.push('Collaboration requests setting must be a boolean');
    }

    if (typeof settings.achievementAlerts !== 'boolean') {
      errors.push('Achievement alerts setting must be a boolean');
    }

    return errors;
  }

  private validatePrivacySettings(settings: any): string[] {
    const errors: string[] = [];

    if (!['public', 'friends', 'private'].includes(settings.profileVisibility)) {
      errors.push('Invalid profile visibility value');
    }

    if (!['public', 'friends', 'private'].includes(settings.locationVisibility)) {
      errors.push('Invalid location visibility value');
    }

    if (!['public', 'friends', 'private'].includes(settings.activityVisibility)) {
      errors.push('Invalid activity visibility value');
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}

export class TerritoryValidator implements IValidator<Territory> {
  validate(data: Territory): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Territory name must be at least 2 characters long');
    }

    if (data.description && data.description.trim().length < 5) {
      errors.push('Description must be at least 5 characters long if provided');
    }

    if (!data.boundaries || data.boundaries.length === 0) {
      errors.push('At least one boundary point is required');
    } else {
      const boundaryErrors = this.validateBoundaries(data.boundaries);
      errors.push(...boundaryErrors);
    }

    if (!data.center || typeof data.center.latitude !== 'number' || typeof data.center.longitude !== 'number') {
      errors.push('Valid center coordinates are required');
    } else {
      if (data.center.latitude < -90 || data.center.latitude > 90) {
        errors.push('Center latitude must be between -90 and 90');
      }
      if (data.center.longitude < -180 || data.center.longitude > 180) {
        errors.push('Center longitude must be between -180 and 180');
      }
    }

    if (typeof data.area !== 'number' || data.area <= 0) {
      errors.push('Area must be a positive number');
    }

    if (!['active', 'inactive', 'pending'].includes(data.status)) {
      errors.push('Invalid territory status');
    }

    if (!this.isValidDate(data.createdAt)) {
      errors.push('Invalid creation date');
    }

    if (!this.isValidDate(data.updatedAt)) {
      errors.push('Invalid update date');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePartial(data: Partial<Territory>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.name !== undefined && data.name) {
      if (data.name.trim().length < 2) {
        errors.push('Territory name must be at least 2 characters long');
      }
    }

    if (data.description !== undefined && data.description) {
      if (data.description.trim().length < 5) {
        errors.push('Description must be at least 5 characters long if provided');
      }
    }

    if (data.boundaries !== undefined && data.boundaries) {
      if (data.boundaries.length === 0) {
        errors.push('At least one boundary point is required');
      } else {
        const boundaryErrors = this.validateBoundaries(data.boundaries);
        errors.push(...boundaryErrors);
      }
    }

    if (data.center !== undefined && data.center) {
      if (typeof data.center.latitude !== 'number' || typeof data.center.longitude !== 'number') {
        errors.push('Valid center coordinates are required');
      } else {
        if (data.center.latitude < -90 || data.center.latitude > 90) {
          errors.push('Center latitude must be between -90 and 90');
        }
        if (data.center.longitude < -180 || data.center.longitude > 180) {
          errors.push('Center longitude must be between -180 and 180');
        }
      }
    }

    if (data.area !== undefined) {
      if (typeof data.area !== 'number' || data.area <= 0) {
        errors.push('Area must be a positive number');
      }
    }

    if (data.status !== undefined) {
      if (!['active', 'inactive', 'pending'].includes(data.status)) {
        errors.push('Invalid territory status');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateBoundaries(boundaries: any[]): string[] {
    const errors: string[] = [];

    boundaries.forEach((boundary, index) => {
      if (typeof boundary.latitude !== 'number' || isNaN(boundary.latitude)) {
        errors.push(`Boundary ${index + 1}: Invalid latitude`);
      } else if (boundary.latitude < -90 || boundary.latitude > 90) {
        errors.push(`Boundary ${index + 1}: Latitude must be between -90 and 90`);
      }

      if (typeof boundary.longitude !== 'number' || isNaN(boundary.longitude)) {
        errors.push(`Boundary ${index + 1}: Invalid longitude`);
      } else if (boundary.longitude < -180 || boundary.longitude > 180) {
        errors.push(`Boundary ${index + 1}: Longitude must be between -180 and 180`);
      }
    });

    return errors;
  }

  private isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const userValidator = new UserValidator();
export const territoryValidator = new TerritoryValidator();