export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  color?: string;
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
  area: number;
  status: 'active' | 'inactive' | 'pending';
  assignedTo?: string;
  owner?: {
    uid: string;
    displayName: string | null;
    photoURL: string | null;
    email: string;
    color: string | null;
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
  radius: number;
  polygon: GeoCoordinates[];
}

export type TerritoryStatus = 'active' | 'inactive' | 'contested' | 'locked';

export interface TerritoryInfo {
  id: string;
  name: string;
  status: TerritoryStatus;
  area: number;
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

export interface ConquestSession {
  id: string;
  userId: string;
  status: ConquestStatus;
  startTime: Date;
  endTime?: Date;
  points: ConquestPoint[];
  totalDistance: number;
  totalArea: number;
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
  minDistanceThreshold: number;
  minTimeThreshold: number;
  accuracyThreshold: number;
}