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
  onLocationPress: (location: MapLocation) => void;
  onTerritoryPress: (territory: Territory) => void;
}

export const MapMarkers: React.FC<MapMarkersProps> = ({
  filteredLocations,
  filteredTerritories,
  trackedPoints,
  userLocation,
  onLocationPress,
  onTerritoryPress,
}) => {
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

      {/* Conquest Tracking Path */}
      {trackedPoints.length > 1 && (
        <Polyline
          coordinates={trackedPoints.map(point => ({
            latitude: point.latitude,
            longitude: point.longitude,
          }))}
          strokeColor="#FF6B35"
          strokeWidth={4}
          lineDashPattern={[10, 5]}
        />
      )}

      {/* Conquest Tracking Points */}
      {trackedPoints.map((point, index) => (
        <Marker
          key={point.id}
          coordinate={{
            latitude: point.latitude,
            longitude: point.longitude,
          }}
          title={`Point ${index + 1}`}
          description={`Accuracy: ${point.accuracy?.toFixed(1) || 'N/A'}m`}
          pinColor="#FF6B35"
        />
      ))}

      {/* User Location Marker (if available) */}
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="Your Location"
          description="You are here"
          pinColor="purple"
        />
      )}
    </>
  );
};

