import React, { useMemo } from 'react';
import { Circle } from 'react-native-maps';
import { CARTOON_COLORS } from '../../config/mapStyles';
import type { Territory } from '../../types/game';

interface TerritoryCircleProps {
  territory: Territory;
  opacity?: number;
}

export const TerritoryCircle: React.FC<TerritoryCircleProps> = React.memo(({ 
  territory, 
  opacity = 0.6 
}) => {
  
  const { fillColor, strokeColor } = useMemo(() => {
    
    const baseColor = territory.color || CARTOON_COLORS.territory.neutral;

    const hexToRgba = (hex: string, alpha: number) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return `rgba(255, 107, 107, ${alpha})`; 
      
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      fillColor: hexToRgba(baseColor, opacity),
      strokeColor: hexToRgba(baseColor, 1.0), 
    };
  }, [territory.color, opacity]);

  const center = useMemo(() => ({
    latitude: territory.latitude,
    longitude: territory.longitude,
  }), [territory.latitude, territory.longitude]);

  return (
    <Circle
      center={center}
      radius={territory.radius}
      fillColor={fillColor}
      strokeColor={strokeColor}
      strokeWidth={5} 
      zIndex={10}
    />
  );
});

TerritoryCircle.displayName = 'TerritoryCircle';