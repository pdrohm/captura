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
  
  // Use refs to prevent infinite loops
  const isSyncingRef = useRef(false);
  const lastPlayerUpdateRef = useRef<number>(0);

  // Initialize player in Firestore if they don't exist
  const initializePlayer = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      const existingPlayer = await gameService.getPlayerStats(user.uid);
      
      if (!existingPlayer) {
        // Initialize new player with current local stats
        await gameService.initializePlayer(user.uid, player);
      } else {
        // Sync local store with Firestore data
        useGameStore.setState({ player: existingPlayer });
      }

      setIsInitialized(true);
    } catch {
      setError('Failed to initialize player');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player]);

  // Calculate user's territory count from all territories
  const calculateUserTerritoryCount = useCallback((allTerritories: Territory[]) => {
    if (!user?.uid) return 0;
    return allTerritories.filter(territory => territory.playerId === user.uid).length;
  }, [user?.uid]);

  // Load territories from Firestore
  const loadTerritories = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load all territories for display (so you can see other players' territories)
      const allTerritories = await gameService.getAllTerritories();
      useGameStore.setState({ territories: allTerritories });
      
      // Update player's totalTerritory count based on their actual territories
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



  // Mark territory in Firestore
  const markTerritory = useCallback(async (latitude: number, longitude: number) => {
    if (!user?.uid) return false;

    try {
      setIsLoading(true);
      setError(null);

      // Check if player can mark territory
      if (player.dailyUrinations >= player.maxDailyUrinations) {
        setError('Daily urination limit reached');
        return false;
      }

      // Mark territory in Firestore with user info
      const newTerritory = await gameService.markTerritory(
        user.uid,
        latitude,
        longitude,
        player.territoryRadius,
        getRandomTerritoryColor(),
        user.displayName || undefined,
        user.color || undefined
      );

      // Update local store
      useGameStore.setState(state => ({
        territories: [...state.territories, newTerritory],
        player: {
          ...state.player,
          dailyUrinations: state.player.dailyUrinations + 1,
          totalTerritory: state.player.totalTerritory + 1,
          experience: state.player.experience + 10,
        },
      }));

      // Check achievements
      localCheckAchievements();

      return true;
    } catch {
      setError('Failed to mark territory');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player.dailyUrinations, player.maxDailyUrinations, player.territoryRadius, localCheckAchievements, user?.color, user?.displayName]);

  // Manual sync player stats with Firestore (only when explicitly called)
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



  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.uid || !isInitialized) return;


    // Subscribe to player stats changes
    const unsubscribePlayer = gameService.subscribeToPlayerStats(user.uid, (stats) => {
      if (stats) {
        // Only update if the data is actually different to prevent loops
        const currentTime = Date.now();
        if (currentTime - lastPlayerUpdateRef.current > 2000) { // Increased debounce to 2 seconds
          useGameStore.setState({ player: stats });
          lastPlayerUpdateRef.current = currentTime;
        }
      }
    });

    // Subscribe to territories changes with debouncing
    let territoriesTimeout: ReturnType<typeof setTimeout>;
    const unsubscribeTerritories = gameService.subscribeToTerritories((territories) => {
      // Debounce territory updates to prevent rapid re-renders
      clearTimeout(territoriesTimeout);
      territoriesTimeout = setTimeout(() => {
        useGameStore.setState({ territories });
        
        // Update player's totalTerritory count based on their actual territories
        const userTerritoryCount = calculateUserTerritoryCount(territories);
        useGameStore.setState(state => ({
          player: {
            ...state.player,
            totalTerritory: userTerritoryCount,
          },
        }));
        
      }, 500); // 500ms debounce
    });

    // Subscribe to game state changes
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

  // Initialize on mount
  useEffect(() => {
    if (user?.uid && !isInitialized) {
      initializePlayer();
      loadTerritories();
    }
  }, [user?.uid, isInitialized, initializePlayer, loadTerritories]);

  // Remove the automatic sync effect that was causing the loop
  // useEffect(() => {
  //   if (user?.uid && isInitialized) {
  //     syncPlayerStats();
  //   }
  // }, [user?.uid, isInitialized, syncPlayerStats]);

  // Daily reset functionality
  const resetDailyUrinations = useCallback(async () => {
    if (!user?.uid) return;

    try {
      await gameService.resetDailyUrinations(user.uid);
      localResetDailyUrinations();
    } catch {
      setError('Failed to reset daily urinations');
    }
  }, [user?.uid, localResetDailyUrinations]);

  // Update settings in Firestore
  const updateSettings = useCallback(async (settings: GameState['settings']) => {
    if (!user?.uid) return;

    try {
      await gameService.updateGameSettings(user.uid, settings);
      localUpdateSettings(settings);
    } catch {
      setError('Failed to update settings');
    }
  }, [user?.uid, localUpdateSettings]);

  // Get leaderboard data
  const getLeaderboard = useCallback(async (type: 'territories' | 'level' | 'coins') => {
    try {
      return await gameService.getLeaderboard(type);
    } catch {
      setError('Failed to get leaderboard');
      return [];
    }
  }, []);

  // Get territories in radius (for multiplayer)
  const getTerritoriesInRadius = useCallback(async (latitude: number, longitude: number, radius: number) => {
    try {
      return await gameService.getTerritoriesInRadius(latitude, longitude, radius);
    } catch {
      setError('Failed to get territories in radius');
      return [];
    }
  }, []);

  // Get user's own territories (for stats, profile, etc.)
  const getUserTerritories = useCallback(() => {
    if (!user?.uid) return [];
    const allTerritories = useGameStore.getState().territories;
    return allTerritories.filter(territory => territory.playerId === user.uid);
  }, [user?.uid]);

  return {
    // State
    isLoading,
    error,
    isInitialized,
    
    // Actions
    markTerritory,
    resetDailyUrinations,
    updateSettings,
    getLeaderboard,
    getTerritoriesInRadius,
    
    // Manual sync
    syncPlayerStats,
    loadTerritories,
    initializePlayer,
    
    // Territory helpers
    getUserTerritories,
  };
};

// Helper function for territory colors
function getRandomTerritoryColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
