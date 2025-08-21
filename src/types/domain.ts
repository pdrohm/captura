// Core domain types for the Dogeatdog app

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  color?: string; // User's chosen color for territories
  createdAt: Date;
  lastActiveAt: Date;
  preferences: UserPreferences;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  units: 'metric' | 'imperial';
  notifications: boolean;
  locationSharing: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  territoryUpdates: boolean;
  collaborationRequests: boolean;
  achievementAlerts: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  locationVisibility: 'public' | 'friends' | 'private';
  activityVisibility: 'public' | 'friends' | 'private';
}

// Map Domain Types
export interface MapLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  type: 'territory' | 'point_of_interest' | 'boundary';
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Territory {
  id: string;
  name: string;
  description?: string;
  boundaries: MapLocation[];
  center: {
    latitude: number;
    longitude: number;
  };
  area: number; // in square meters
  status: 'active' | 'inactive' | 'pending';
  assignedTo?: string; // user ID
  owner?: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    email: string;
    color: string | null; // User's territory color
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapViewport {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapFilters {
  showTerritories: boolean;
  showPointsOfInterest: boolean;
  showBoundaries: boolean;
  territoryStatus?: Territory['status'][];
}

export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoBoundary {
  center: GeoCoordinates;
  radius: number; // in meters
  polygon: GeoCoordinates[];
}

export type TerritoryStatus = 'active' | 'inactive' | 'contested' | 'locked';

export interface TerritoryMetadata {
  area: number; // in square meters
  population?: number;
  points: number;
  level: number;
  tags: string[];
  description?: string;
}

export interface TerritoryActivity {
  id: string;
  territoryId: string;
  userId: string;
  type: ActivityType;
  timestamp: Date;
  metadata: Record<string, any>;
}

export type ActivityType = 'claim' | 'visit' | 'upgrade' | 'challenge' | 'collaboration';

export interface SearchFilters {
  query?: string;
  location?: GeoCoordinates;
  radius?: number;
  status?: TerritoryStatus[];
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

export interface TerritoryEvent {
  id: string;
  territoryId: string;
  type: 'claim' | 'challenge' | 'upgrade' | 'visit';
  userId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

// Conquest Mode Types
export interface ConquestSession {
  id: string;
  userId: string;
  status: ConquestStatus;
  startTime: Date;
  endTime?: Date;
  points: ConquestPoint[];
  totalDistance: number; // in meters
  totalArea: number; // in square meters
  metadata: Record<string, any>;
}

export interface ConquestPoint {
  id: string;
  sessionId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export type ConquestStatus = 'idle' | 'tracking' | 'paused' | 'completed' | 'cancelled';

export interface ConquestSettings {
  autoSave: boolean;
  minDistanceThreshold: number; // minimum distance between points in meters
  minTimeThreshold: number; // minimum time between points in milliseconds
  accuracyThreshold: number; // minimum accuracy required in meters
}
