// Repository interfaces for the data access layer

import {
  Territory as DomainTerritory,
  MapFilters,
  MapLocation,
  MapViewport,
  PaginationOptions,
  SearchFilters,
  SearchResult,
  TerritoryActivity,
  User
} from './domain';

// Base repository interface
export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}

// User repository interface
export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUid(uid: string): Promise<User | null>;
  updatePreferences(uid: string, preferences: Partial<User['preferences']>): Promise<User>;
  updateProfile(uid: string, profile: Partial<Pick<User, 'displayName' | 'photoURL'>>): Promise<User>;
  findCollaborators(territoryId: string): Promise<User[]>;
  findTerritoryOwners(): Promise<User[]>;
  searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>>;
}

// Territory repository interface
export interface ITerritoryRepository extends IBaseRepository<DomainTerritory> {
  findByOwner(ownerId: string): Promise<DomainTerritory[]>;
  findByLocation(coordinates: { latitude: number; longitude: number }, radius: number): Promise<DomainTerritory[]>;
  findByStatus(status: DomainTerritory['status']): Promise<DomainTerritory[]>;
  findByTags(tags: string[]): Promise<DomainTerritory[]>;
  searchTerritories(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<DomainTerritory>>;
  claimTerritory(territoryId: string, userId: string): Promise<DomainTerritory>;
  releaseTerritory(territoryId: string, userId: string): Promise<boolean>;
}

// Territory activity repository interface
export interface ITerritoryActivityRepository extends IBaseRepository<TerritoryActivity> {
  findByTerritory(territoryId: string): Promise<TerritoryActivity[]>;
  findByUser(userId: string): Promise<TerritoryActivity[]>;
  findByType(type: TerritoryActivity['type']): Promise<TerritoryActivity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<TerritoryActivity[]>;
}

// Search repository interface
export interface ISearchRepository {
  searchTerritories(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<DomainTerritory>>;
  searchUsers(query: string, pagination: PaginationOptions): Promise<SearchResult<User>>;
  searchActivities(filters: SearchFilters, pagination: PaginationOptions): Promise<SearchResult<TerritoryActivity>>;
}

// Cache repository interface
export interface ICacheRepository<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// Sync repository interface
export interface ISyncRepository {
  syncOfflineActions(): Promise<void>;
  getPendingActions(): Promise<any[]>;
  markActionComplete(actionId: string): Promise<void>;
  getLastSyncTimestamp(): Promise<Date | null>;
}

// Error handler interface
export interface IErrorHandler {
  handle(error: Error | any): void;
  log(error: Error | any): void;
  getUserFriendlyMessage(error: Error | any): string;
  isRetryable(error: Error | any): boolean;
}

// Validator interface
export interface IValidator<T> {
  validate(data: T): { isValid: boolean; errors: string[] };
  validatePartial(data: Partial<T>): { isValid: boolean; errors: string[] };
}

// Re-export domain types
export type { ApiError } from './domain';

// Map Repository Interfaces
export interface MapRepository {
  getMapLocations(filters: MapFilters): Promise<MapLocation[]>;
  getTerritories(filters: MapFilters): Promise<DomainTerritory[]>;
  saveMapLocation(location: Omit<MapLocation, 'id' | 'createdAt' | 'updatedAt'>): Promise<MapLocation>;
  updateMapLocation(id: string, updates: Partial<MapLocation>): Promise<MapLocation>;
  deleteMapLocation(id: string): Promise<void>;
  getMapViewport(): Promise<MapViewport>;
  saveMapViewport(viewport: MapViewport): Promise<void>;
}
