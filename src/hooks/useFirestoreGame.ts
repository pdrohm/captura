import { gameService } from '@/src/services/gameService';
import { useAuthStore } from '@/src/stores/authStore';
import { useGameStore } from '@/src/stores/gameStore';
import { GameState } from '@/src/types/game';
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
        console.log('✅ New player initialized in Firestore');
      } else {
        // Sync local store with Firestore data
        useGameStore.setState({ player: existingPlayer });
        console.log('✅ Player data synced from Firestore');
      }

      setIsInitialized(true);
    } catch (err) {
      console.error('❌ Failed to initialize player:', err);
      setError('Failed to initialize player');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player]);

  // Load territories from Firestore
  const loadTerritories = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      const firestoreTerritories = await gameService.getAllTerritories();
      useGameStore.setState({ territories: firestoreTerritories });
      
      console.log('✅ Territories loaded from Firestore:', firestoreTerritories.length);
    } catch (err) {
      console.error('❌ Failed to load territories:', err);
      setError('Failed to load territories');
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);



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

      // Mark territory in Firestore
      const newTerritory = await gameService.markTerritory(
        user.uid,
        latitude,
        longitude,
        player.territoryRadius,
        getRandomTerritoryColor()
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

      console.log('✅ Territory marked in Firestore:', newTerritory.id);
      return true;
    } catch (err) {
      console.error('❌ Failed to mark territory:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark territory');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid, player.dailyUrinations, player.maxDailyUrinations, player.territoryRadius, localCheckAchievements]);

  // Manual sync player stats with Firestore (only when explicitly called)
  const syncPlayerStats = useCallback(async () => {
    if (!user?.uid || isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;
      await gameService.updatePlayerStats(user.uid, player);
      console.log('✅ Player stats synced to Firestore');
    } catch (err) {
      console.error('❌ Failed to sync player stats:', err);
      setError('Failed to sync player stats');
    } finally {
      isSyncingRef.current = false;
    }
  }, [user?.uid, player]);



  // Subscribe to real-time updates
  useEffect(() => {
    if (!user?.uid || !isInitialized) return;

    console.log('🔄 Setting up real-time subscriptions...');

    // Subscribe to player stats changes
    const unsubscribePlayer = gameService.subscribeToPlayerStats(user.uid, (stats) => {
      if (stats) {
        // Only update if the data is actually different to prevent loops
        const currentTime = Date.now();
        if (currentTime - lastPlayerUpdateRef.current > 2000) { // Increased debounce to 2 seconds
          useGameStore.setState({ player: stats });
          lastPlayerUpdateRef.current = currentTime;
          console.log('🔄 Player stats updated from Firestore');
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
        console.log('🔄 Territories updated from Firestore:', territories.length);
      }, 500); // 500ms debounce
    });

    // Subscribe to game state changes
    const unsubscribeGameState = gameService.subscribeToGameState(user.uid, (gameState) => {
      if (gameState) {
        useGameStore.setState(gameState);
        console.log('🔄 Game state updated from Firestore');
      }
    });

    return () => {
      clearTimeout(territoriesTimeout);
      unsubscribePlayer();
      unsubscribeTerritories();
      unsubscribeGameState();
      console.log('🔄 Real-time subscriptions cleaned up');
    };
  }, [user?.uid, isInitialized]);

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
      console.log('✅ Daily urinations reset in Firestore');
    } catch (err) {
      console.error('❌ Failed to reset daily urinations:', err);
      setError('Failed to reset daily urinations');
    }
  }, [user?.uid, localResetDailyUrinations]);

  // Update settings in Firestore
  const updateSettings = useCallback(async (settings: GameState['settings']) => {
    if (!user?.uid) return;

    try {
      await gameService.updateGameSettings(user.uid, settings);
      localUpdateSettings(settings);
      console.log('✅ Settings updated in Firestore');
    } catch (err) {
      console.error('❌ Failed to update settings:', err);
      setError('Failed to update settings');
    }
  }, [user?.uid, localUpdateSettings]);

  // Get leaderboard data
  const getLeaderboard = useCallback(async (type: 'territories' | 'level' | 'coins') => {
    try {
      return await gameService.getLeaderboard(type);
    } catch (err) {
      console.error('❌ Failed to get leaderboard:', err);
      setError('Failed to get leaderboard');
      return [];
    }
  }, []);

  // Get territories in radius (for multiplayer)
  const getTerritoriesInRadius = useCallback(async (latitude: number, longitude: number, radius: number) => {
    try {
      return await gameService.getTerritoriesInRadius(latitude, longitude, radius);
    } catch (err) {
      console.error('❌ Failed to get territories in radius:', err);
      setError('Failed to get territories in radius');
      return [];
    }
  }, []);

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
