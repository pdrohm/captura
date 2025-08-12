import { errorHandler } from '@/src/services/errorHandler';
import { territoryRepository } from '@/src/services/territoryRepository';
import { TerritoryUseCases } from '@/src/services/useCases/territoryUseCases';
import { Territory } from '@/src/types/domain';
import { useCallback, useEffect, useState } from 'react';

export const useTerritoryWithOwner = (territoryId: string | null) => {
  const [territory, setTerritory] = useState<Territory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTerritory = useCallback(async () => {
    if (!territoryId) {
      setTerritory(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const territoryUseCases = new TerritoryUseCases(territoryRepository, errorHandler);
      const fetchedTerritory = await territoryUseCases.getTerritoryWithOwner(territoryId);
      setTerritory(fetchedTerritory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch territory');
      console.error('Error fetching territory with owner:', err);
    } finally {
      setLoading(false);
    }
  }, [territoryId]);

  useEffect(() => {
    fetchTerritory();
  }, [fetchTerritory]);

  const refetch = useCallback(() => {
    fetchTerritory();
  }, [fetchTerritory]);

  return {
    territory,
    loading,
    error,
    refetch,
  };
};
