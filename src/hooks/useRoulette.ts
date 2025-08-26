import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { authService } from '../services/firebase';
import { useGameStore } from '../stores/gameStore';
import { useRouletteStore } from '../stores/rouletteStore';

export const useRoulette = () => {
  const {
    isSpinning,
    stats,
    history,
    canSpin,
    spinCost,
    lastResult,
    initializeStats,
    spinWheel,
    resetSpinning,
    loadHistory,
    checkDailyReset,
  } = useRouletteStore();

  const { player } = useGameStore();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.uid) {
      initializeStats(currentUser.uid);
      loadHistory(currentUser.uid);
      checkDailyReset(currentUser.uid);
    }
  }, [initializeStats, loadHistory, checkDailyReset]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.uid) {
      checkDailyReset(currentUser.uid);
    }
  }, [checkDailyReset]);

  const handleSpin = useCallback(async () => {
    if (isSpinning || !canSpin) {
      return null;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await spinWheel();
      
      if (result) {
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, result.spinDuration);
      }
      
      return result;
    } catch (error) {
      console.error('Error spinning wheel:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return null;
    }
  }, [isSpinning, canSpin, spinWheel]);

  const getSpinCost = useCallback(() => {
    const hasFreeSpin = stats.freeSpinsRemaining > 0;
    return hasFreeSpin ? 0 : spinCost;
  }, [stats.freeSpinsRemaining, spinCost]);

  const canAffordSpin = useCallback(() => {
    const cost = getSpinCost();
    return cost === 0 || player.coins >= cost;
  }, [getSpinCost, player.coins]);

  const getRewardText = useCallback((reward: any) => {
    switch (reward.type) {
      case 'coins':
        return `${reward.amount} Coins`;
      case 'experience':
        return `${reward.amount} XP`;
      case 'urinations':
        return `+${reward.amount} Daily Pee${reward.amount > 1 ? 's' : ''}`;
      case 'radius':
        return `+${reward.amount}m Territory`;
      case 'jackpot':
        return `JACKPOT! ${reward.amount * (reward.multiplier || 1)} Coins`;
      default:
        return 'Unknown Reward';
    }
  }, []);

  return {
    isSpinning,
    stats,
    history,
    canSpin: canSpin && canAffordSpin(),
    spinCost: getSpinCost(),
    lastResult,
    
    handleSpin,
    resetSpinning,
    
    getRewardText,
    canAffordSpin,
  };
};