// Use case interfaces for the business logic layer

import {
  User,
  Territory,
  TerritoryActivity,
  SearchFilters,
  PaginationOptions,
  SearchResult,
  UserPreferences,
  GeoCoordinates,
  GeoBoundary
} from './domain';

// User use cases interface
export interface IUserUseCases {
  getCurrentUser(): Promise<User | null>;
  updateProfile(uid: string, profile: Partial<Pick<User, 'displayName' | 'photoURL'>>): Promise<User>;
  updatePreferences(uid: string, preferences: Partial<UserPreferences>): Promise<User>;
  deleteAccount(uid: string): Promise<boolean>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(uid: string): Promise<User | null>;
  searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>>;
  getCollaborators(territoryId: string): Promise<User[]>;
  inviteUserToTerritory(territoryId: string, userEmail: string): Promise<boolean>;
  removeUserFromTerritory(territoryId: string, userId: string): Promise<boolean>;
}

// Territory use cases interface
export interface ITerritoryUseCases {
  createTerritory(data: Omit<Territory, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt'>): Promise<Territory>;
  updateTerritory(id: string, data: Partial<Territory>): Promise<Territory>;
  deleteTerritory(id: string): Promise<boolean>;
  claimTerritory(territoryId: string, userId: string): Promise<Territory>;
  releaseTerritory(territoryId: string, userId: string): Promise<boolean>;
  getTerritoryById(id: string): Promise<Territory | null>;
  getTerritoriesByOwner(ownerId: string): Promise<Territory[]>;
  getTerritoriesByLocation(coordinates: GeoCoordinates, radius: number): Promise<Territory[]>;
  searchTerritories(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<Territory>>;
  upgradeTerritory(territoryId: string, userId: string): Promise<Territory>;
  challengeTerritory(territoryId: string, challengerId: string): Promise<boolean>;
}

// Territory activity use cases interface
export interface ITerritoryActivityUseCases {
  recordActivity(activity: Omit<TerritoryActivity, 'id' | 'timestamp'>): Promise<TerritoryActivity>;
  getTerritoryActivities(territoryId: string): Promise<TerritoryActivity[]>;
  getUserActivities(userId: string): Promise<TerritoryActivity[]>;
  getActivitiesByType(type: TerritoryActivity['type']): Promise<TerritoryActivity[]>;
  getActivitiesByDateRange(startDate: Date, endDate: Date): Promise<TerritoryActivity[]>;
}

// Search use cases interface
export interface ISearchUseCases {
  searchTerritories(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<Territory>>;
  searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>>;
  searchActivities(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<TerritoryActivity>>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getPopularSearches(): Promise<string[]>;
}

// Collaboration use cases interface
export interface ICollaborationUseCases {
  inviteUser(territoryId: string, userEmail: string, role: string): Promise<boolean>;
  acceptInvitation(invitationId: string): Promise<boolean>;
  declineInvitation(invitationId: string): Promise<boolean>;
  removeCollaborator(territoryId: string, userId: string): Promise<boolean>;
  getCollaborators(territoryId: string): Promise<User[]>;
  getPendingInvitations(userId: string): Promise<any[]>;
}

// Sync use cases interface
export interface ISyncUseCases {
  syncOfflineActions(): Promise<void>;
  getPendingActions(): Promise<any[]>;
  markActionComplete(actionId: string): Promise<void>;
  getLastSyncTimestamp(): Promise<Date | null>;
  forceSync(): Promise<void>;
}

// Analytics use cases interface
export interface IAnalyticsUseCases {
  trackEvent(eventName: string, properties: Record<string, any>): Promise<void>;
  trackUserAction(action: string, context: Record<string, any>): Promise<void>;
  trackTerritoryAction(territoryId: string, action: string, context: Record<string, any>): Promise<void>;
  getAnalyticsReport(startDate: Date, endDate: Date): Promise<any>;
}

// Notification use cases interface
export interface INotificationUseCases {
  sendPushNotification(userId: string, title: string, body: string, data?: Record<string, any>): Promise<boolean>;
  sendEmailNotification(userId: string, subject: string, body: string): Promise<boolean>;
  subscribeToTopic(userId: string, topic: string): Promise<boolean>;
  unsubscribeFromTopic(userId: string, topic: string): Promise<boolean>;
  getNotificationSettings(userId: string): Promise<any>;
  updateNotificationSettings(userId: string, settings: any): Promise<boolean>;
}

// Data portability use cases interface
export interface IDataPortabilityUseCases {
  exportUserData(userId: string): Promise<string>;
  importUserData(userId: string, data: string): Promise<boolean>;
  deleteUserData(userId: string): Promise<boolean>;
  getDataUsage(userId: string): Promise<any>;
  backupData(userId: string): Promise<string>;
  restoreFromBackup(backupData: string): Promise<void>;
}
