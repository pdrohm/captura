# Territory Ownership Feature

## Overview

The territory ownership feature allows users to claim territories and view information about territory owners. When a territory is claimed, it becomes associated with a specific user, and other users can see who owns each territory.

## Features

### 1. Territory Ownership Display
- **Territory Cards**: Show owner information in territory listings
- **Territory Details**: Full owner profile when viewing territory details
- **Map Markers**: Display ownership status on the map with different colors
- **Owner Profiles**: Show owner's name, email, and avatar

### 2. Territory Claiming
- Users can claim unclaimed territories
- Territories show different visual states (claimed vs unclaimed)
- Owner information is automatically fetched and displayed

### 3. Visual Indicators
- **Claimed Territories**: Blue markers on map, owner info displayed
- **Unclaimed Territories**: Orange markers on map, "Unclaimed" status
- **Owner Avatars**: Display user initials or profile photos

## Implementation Details

### Domain Model Updates

The `Territory` interface now includes owner information:

```typescript
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
  assignedTo?: string; // user ID
  owner?: {
    uid: string;
    displayName?: string;
    photoURL?: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Repository Layer

The `FirestoreTerritoryRepository` includes methods to fetch territories with owner information:

```typescript
async getTerritoryWithOwner(territoryId: string): Promise<Territory | null>
```

This method fetches the territory and then looks up the owner's user information from the users collection.

### Use Cases

The `TerritoryUseCases` class provides business logic for territory operations:

```typescript
async getTerritoryWithOwner(id: string): Promise<Territory | null>
```

### Components

#### TerritoryCard
- Displays owner information in territory listings
- Shows owner avatar, name, and "Owner" label
- Handles loading states for owner information

#### TerritoryDetails
- Full territory information modal
- Complete owner profile display
- Edit and claim actions for territory owners
- Responsive design with proper theming

#### MapMarkers
- Different colors for claimed vs unclaimed territories
- Owner information in marker descriptions
- Visual distinction between territory states

### Custom Hooks

#### useTerritoryWithOwner
```typescript
const { territory, loading, error, refetch } = useTerritoryWithOwner(territoryId);
```

This hook automatically fetches territory with owner information and handles loading states.

## Usage Examples

### 1. Display Territory with Owner Info

```typescript
import { TerritoryDetails } from './components/TerritoryDetails';

function TerritoryView({ territory }) {
  return (
    <TerritoryDetails
      territory={territory}
      onClose={() => setShowDetails(false)}
      onEdit={() => handleEdit(territory)}
    />
  );
}
```

### 2. Fetch Territory with Owner

```typescript
import { useTerritoryWithOwner } from './hooks/useTerritoryWithOwner';

function TerritoryInfo({ territoryId }) {
  const { territory, loading, error } = useTerritoryWithOwner(territoryId);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <View>
      <Text>{territory.name}</Text>
      {territory.owner && (
        <Text>Owner: {territory.owner.displayName}</Text>
      )}
    </View>
  );
}
```

### 3. Claim a Territory

```typescript
import { TerritoryUseCases } from '@/src/services/useCases/territoryUseCases';

const territoryUseCases = new TerritoryUseCases(repository, errorHandler);

async function claimTerritory(territoryId: string, userId: string) {
  try {
    const updatedTerritory = await territoryUseCases.claimTerritory(territoryId, userId);
    console.log('Territory claimed:', updatedTerritory);
  } catch (error) {
    console.error('Failed to claim territory:', error);
  }
}
```

## Database Structure

### Territories Collection
```javascript
{
  id: "territory_123",
  name: "Downtown District",
  description: "The heart of the city",
  boundaries: [...],
  center: { latitude: 40.7128, longitude: -74.0060 },
  area: 50000,
  status: "active",
  assignedTo: "user_456", // User ID
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Users Collection
```javascript
{
  uid: "user_456",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  createdAt: Timestamp,
  lastActiveAt: Timestamp
}
```

## Future Enhancements

1. **Owner Profile Pages**: Dedicated pages to view owner profiles
2. **Territory Transfer**: Allow owners to transfer territories to other users
3. **Collaboration**: Multiple users can collaborate on territories
4. **Territory History**: Track ownership changes over time
5. **Notifications**: Alert users when their territories are challenged
6. **Privacy Settings**: Control what owner information is visible

## Security Considerations

- Owner information is fetched from the users collection
- Only public user information is displayed (name, email)
- Private user data is not exposed
- Territory claiming requires proper authentication
- Users can only claim unclaimed territories

## Testing

The feature includes comprehensive testing for:
- Territory ownership display
- Owner information fetching
- Territory claiming functionality
- Error handling for missing owner data
- Loading states and user experience
