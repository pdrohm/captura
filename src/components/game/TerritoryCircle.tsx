import React, { useMemo } from 'react';
import { Circle } from 'react-native-maps';
import type { Territory } from '../../types/game';

interface TerritoryCircleProps {
  territory: Territory;
  opacity?: number;
}

export const TerritoryCircle: React.FC<TerritoryCircleProps> = React.memo(({ 
  territory, 
  opacity = 0.3 
}) => {
  const fillColor = useMemo(() => 
    `${territory.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    [territory.color, opacity]
  );

  const center = useMemo(() => ({
    latitude: territory.latitude,
    longitude: territory.longitude,
  }), [territory.latitude, territory.longitude]);

  return (
    <Circle
      center={center}
      radius={territory.radius}
      fillColor={fillColor}
      strokeColor={territory.color}
      strokeWidth={2}
    />
  );
});