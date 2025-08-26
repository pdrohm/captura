import { useMapStore } from '@/src/stores/mapStore';
import { Territory } from '@/src/types/domain';
import { useCallback, useEffect, useRef } from 'react';

interface UseTerritorySyncProps {
  onTerritoryAdded?: (territory: Territory) => void;
  onTerritoryUpdated?: (territory: Territory) => void;
  onTerritoryDeleted?: (territoryId: string) => void;
}

export const useTerritorySync = ({
  onTerritoryAdded,
  onTerritoryUpdated,
  onTerritoryDeleted
}: UseTerritorySyncProps = {}) => {
  const { territories } = useMapStore();
  const previousTerritoriesRef = useRef<Territory[]>([]);

  useEffect(() => {
    const previousTerritories = previousTerritoriesRef.current;

    if (onTerritoryAdded) {
      const addedTerritories = territories.filter(
        territory => !previousTerritories.find(prev => prev.id === territory.id)
      );
      
      addedTerritories.forEach(territory => {
        onTerritoryAdded(territory);
      });
    }

    if (onTerritoryUpdated) {
      territories.forEach(territory => {
        const previousTerritory = previousTerritories.find(prev => prev.id === territory.id);
        if (previousTerritory && 
            (territory.updatedAt !== previousTerritory.updatedAt || 
             JSON.stringify(territory) !== JSON.stringify(previousTerritory))) {
          onTerritoryUpdated(territory);
        }
      });
    }

    if (onTerritoryDeleted) {
      const deletedTerritories = previousTerritories.filter(
        previousTerritory => !territories.find(territory => territory.id === previousTerritory.id)
      );
      
      deletedTerritories.forEach(territory => {
        onTerritoryDeleted(territory.id);
      });
    }

    previousTerritoriesRef.current = [...territories];
  }, [territories, onTerritoryAdded, onTerritoryUpdated, onTerritoryDeleted]);

  const refreshTerritories = useCallback(() => {

  }, []);

  return {
    territories,
    refreshTerritories,
  };
};