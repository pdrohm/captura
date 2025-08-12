import { MapLocation, Territory } from '@/src/types/domain';
import React from 'react';
import { Marker, Polygon, Polyline } from 'react-native-maps';

interface ConquestPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface MapMarkersProps {
  filteredLocations: MapLocation[];
  filteredTerritories: Territory[];
  trackedPoints: ConquestPoint[];
  userLocation: { latitude: number; longitude: number } | null;
  conquestStatus?: 'idle' | 'tracking' | 'paused' | 'completed';
  onLocationPress: (location: MapLocation) => void;
  onTerritoryPress: (territory: Territory) => void;
}

export const MapMarkers: React.FC<MapMarkersProps> = ({
  filteredLocations,
  filteredTerritories,
  trackedPoints,
  userLocation,
  conquestStatus = 'idle',
  onLocationPress,
  onTerritoryPress,
}) => {
  // Get start and end points for conquest tracking
  const startPoint = trackedPoints[0];
  const endPoint = trackedPoints[trackedPoints.length - 1];
  const hasMultiplePoints = trackedPoints.length > 1;

  return (
    <>
      {/* Plot Locations as Markers */}
      {filteredLocations.map(location => (
        <Marker
          key={location.id}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title={location.title}
          description={location.description}
          onPress={() => onLocationPress(location)}
          pinColor={
            location.type === 'territory' ? 'blue' :
            location.type === 'point_of_interest' ? 'red' : 'green'
          }
        />
      ))}

      {/* Plot Territories as Polygons */}
      {filteredTerritories.map(territory => (
        <Polygon
          key={territory.id}
          coordinates={territory.boundaries.map(boundary => ({
            latitude: boundary.latitude,
            longitude: boundary.longitude,
          }))}
          fillColor="rgba(0, 122, 255, 0.2)"
          strokeColor="rgba(0, 122, 255, 0.8)"
          strokeWidth={2}
          onPress={() => onTerritoryPress(territory)}
        />
      ))}

      {/* Conquest Tracking Path - Draw line connecting all points */}
      {hasMultiplePoints && (
        <Polyline
          coordinates={trackedPoints.map(point => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))}
          strokeColor="#FF6B35"
          strokeWidth={6}
          lineDashPattern={[15, 8]}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {/* Conquest Start Marker */}
      {startPoint && (
        <Marker
          coordinate={{
            latitude: startPoint.latitude,
            longitude: startPoint.longitude,
          }}
          title="Conquest Start"
          description="Starting point of your conquest"
          pinColor="#34C759" // Green for start
          opacity={0.9}
        />
      )}

      {/* Conquest End Marker - Only show if different from start */}
      {endPoint && hasMultiplePoints && startPoint?.id !== endPoint?.id && (
        <Marker
          coordinate={{
            latitude: endPoint.latitude,
            longitude: endPoint.longitude,
          }}
          title="Conquest End"
          description="Ending point of your conquest"
          pinColor="#FF3B30" // Red for end
          opacity={0.9}
        />
      )}

      {/* User Location Marker - Only show when not in conquest mode */}
      {/* Note: The native blue dot is handled by showsUserLocation prop in MapView */}
      {/* We only show a custom marker if needed for specific styling */}
    </>
  );
};

