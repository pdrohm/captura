import { gameService } from '@/src/services/gameService';
import { useAuthStore } from '@/src/stores/authStore';
import { useGameStore } from '@/src/stores/gameStore';
import { GameState, Territory } from '@/src/types/game';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useFirestoreGame = () => {
  const { user } = useAuthStore();
  const { 
    player, 
    resetDailyUrinations: localResetDailyUrinations,
    updateSettings: localUpdateSettings,
    checkAchievements: localCheckAchievements,
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isSyncingRef = useRef(false);
  const lastPlayerUpdateRef = useRef<number>(0);

  const initializePlayer = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      const existingPlayer = await gameService.getPlayerStats(user.uid);
      
      if (!existingPlayer) {
        
        await gameService.initializePlayer(user.uid, player);
      } else {
        
        useGameStore.setState({ player: existingPlayer });
      }

      setIsInitialized(true);
    } catch {
      setError('Failed to initialize player');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player]);

  const calculateUserTerritoryCount = useCallback((allTerritories: Territory[]) => {
    if (!user?.uid) return 0;
    return allTerritories.filter(territory => territory.playerId === user.uid).length;
  }, [user?.uid]);

  const loadTerritories = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      const allTerritories = await gameService.getAllTerritories();
      useGameStore.setState({ territories: allTerritories });

      const userTerritoryCount = calculateUserTerritoryCount(allTerritories);
      useGameStore.setState(state => ({
        player: {
          ...state.player,
          totalTerritory: userTerritoryCount,
        },
      }));
      
    } catch {
      setError('Failed to load territories');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, calculateUserTerritoryCount]);

  const markTerritory = useCallback(async (latitude: number, longitude: number) => {
    if (!user?.uid) return false;

    try {
      setIsLoading(true);
      setError(null);

      if (player.dailyUrinations >= player.maxDailyUrinations) {
        setError('Daily urination limit reached');
        return false;
      }

      const newTerritory = await gameService.markTerritory(
        user.uid,
        latitude,
        longitude,
        player.territoryRadius,
        getRandomTerritoryColor(),
        user.displayName || undefined,
        user.color || undefined
      );

      useGameStore.setState(state => ({
        territories: [...state.territories, newTerritory],
        player: {
          ...state.player,
          dailyUrinations: state.player.dailyUrinations + 1,
          totalTerritory: state.player.totalTerritory + 1,
          experience: state.player.experience + 10,
        },
      }));

      localCheckAchievements();

      return true;
    } catch {
      setError('Failed to mark territory');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player.dailyUrinations, player.maxDailyUrinations, player.territoryRadius, localCheckAchievements, user?.color, user?.displayName]);

  const syncPlayerStats = useCallback(async () => {
    if (!user?.uid || isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;
      await gameService.updatePlayerStats(user.uid, player);
    } catch {
      setError('Failed to sync player stats');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user?.uid, player]);

  useEffect(() => {
    if (!user?.uid || !isInitialized) return;

    const unsubscribePlayer = gameService.subscribeToPlayerStats(user.uid, (stats) => {
      if (stats) {
        
        const currentTime = Date.now();
        if (currentTime - lastPlayerUpdateRef.current > 2000) { 
          useGameStore.setState({ player: stats });
          lastPlayerUpdateRef.current = currentTime;
        }
      }
    });

    let territoriesTimeout: ReturnType<typeof setTimeout>;
    const unsubscribeTerritories = gameService.subscribeToTerritories((territories) => {
      
      clearTimeout(territoriesTimeout);
      territoriesTimeout = setTimeout(() => {
        useGameStore.setState({ territories });

        const userTerritoryCount = calculateUserTerritoryCount(territories);
        useGameStore.setState(state => ({
          player: {
            ...state.player,
            totalTerritory: userTerritoryCount,
          },
        }));
        
      }, 500); 
    });

    const unsubscribeGameState = gameService.subscribeToGameState(user.uid, (gameState) => {
      if (gameState) {
        useGameStore.setState(gameState);
      }
    });

    return () => {
      clearTimeout(territoriesTimeout);
      unsubscribePlayer();
      unsubscribeTerritories();
      unsubscribeGameState();
    };
  }, [user?.uid, isInitialized, calculateUserTerritoryCount]);

  useEffect(() => {
    if (user?.uid && !isInitialized) {
      initializePlayer();
      loadTerritories();
    }
  }, [user?.uid, isInitialized, initializePlayer, loadTerritories]);

  const resetDailyUrinations = useCallback(async () => {
    if (!user?.uid) return;

    try {
      await gameService.resetDailyUrinations(user.uid);
      localResetDailyUrinations();
    } catch {
      setError('Failed to reset daily urinations');
    }
  }, [user?.uid, localResetDailyUrinations]);

  const updateSettings = useCallback(async (settings: GameState['settings']) => {
    if (!user?.uid) return;

    try {
      await gameService.updateGameSettings(user.uid, settings);
      localUpdateSettings(settings);
    } catch {
      setError('Failed to update settings');
    }
  }, [user?.uid, localUpdateSettings]);

  const getLeaderboard = useCallback(async (type: 'territories' | 'level' | 'coins') => {
    try {
      return await gameService.getLeaderboard(type);
    } catch {
      setError('Failed to get leaderboard');
      return [];
    }
  }, []);

  const getTerritoriesInRadius = useCallback(async (latitude: number, longitude: number, radius: number) => {
    try {
      return await gameService.getTerritoriesInRadius(latitude, longitude, radius);
    } catch {
      setError('Failed to get territories in radius');
      return [];
    }
  }, []);

  const getUserTerritories = useCallback(() => {
    if (!user?.uid) return [];
    const allTerritories = useGameStore.getState().territories;
    return allTerritories.filter(territory => territory.playerId === user.uid);
  }, [user?.uid]);

  return {
    
    isLoading,
    error,
    isInitialized,

    markTerritory,
    resetDailyUrinations,
    updateSettings,
    getLeaderboard,
    getTerritoriesInRadius,

    syncPlayerStats,
    loadTerritories,
    initializePlayer,

    getUserTerritories,
  };
};

function getRandomTerritoryColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}