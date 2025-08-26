import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';

export const useMinigameSync = () => {
  const syncMinigames = useGameStore(state => state.syncMinigames);
  
  useEffect(() => {
    // Sync minigames when the app starts
    syncMinigames();
  }, [syncMinigames]);
};