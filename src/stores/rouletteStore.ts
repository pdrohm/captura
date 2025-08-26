import { create } from 'zustand';
import { rouletteService } from '../services/rouletteService';
import { gameService } from '../services/gameService';
import type { RouletteGame, RouletteResult, RouletteState, RouletteStats } from '../types/roulette';
import { useGameStore } from './gameStore';

const INITIAL_ROULETTE_STATE: RouletteState = {
  isSpinning: false,
  currentAngle: 0,
  lastResult: undefined,
  stats: {
    userId: '',
    totalSpins: 0,
    totalWinnings: 0,
    consecutiveWins: 0,
    lastSpinDate: new Date(),
    freeSpinsRemaining: 1,
    bestWin: { type: 'coins', amount: 0 },
    averageWin: 0,
  },
  history: [],
  canSpin: true,
  spinCost: 10,
};

interface RouletteStore extends RouletteState {
  initializeStats: (userId: string) => Promise<void>;
  spinWheel: () => Promise<RouletteResult | null>;
  resetSpinning: () => void;
  loadHistory: (userId: string) => Promise<void>;
  checkDailyReset: (userId: string) => Promise<void>;
}

export const useRouletteStore = create<RouletteStore>((set, get) => ({
  ...INITIAL_ROULETTE_STATE,

  initializeStats: async (userId: string) => {
    try {
      const stats = await rouletteService.getStats(userId);
      if (stats) {
        set({ stats });
      } else {
        const config = rouletteService.getConfig();
        const newStats: RouletteStats = {
          userId,
          totalSpins: 0,
          totalWinnings: 0,
          consecutiveWins: 0,
          lastSpinDate: new Date(),
          freeSpinsRemaining: config.freeSpinsPerDay,
          bestWin: { type: 'coins', amount: 0 },
          averageWin: 0,
        };
        await rouletteService.updateStats(userId, newStats);
        set({ stats: newStats });
      }
    } catch (error) {
      console.error('Error initializing roulette stats:', error);
    }
  },

  spinWheel: async (): Promise<RouletteResult | null> => {
    const state = get();
    const gameStore = useGameStore.getState();
    
    if (state.isSpinning || !state.canSpin) {
      return null;
    }

    const config = rouletteService.getConfig();
    const hasFreeSpin = state.stats.freeSpinsRemaining > 0;
    const cost = hasFreeSpin ? 0 : config.spinCost;
    
    if (!hasFreeSpin && gameStore.player.coins < cost) {
      return null;
    }

    set({ isSpinning: true });

    try {
      const result = await rouletteService.spinWheel(state.stats.userId, cost);
      
      let winnings = 0;
      let rewardType = result.reward.type;
      let rewardAmount = result.reward.amount;
      
      if (result.reward.type === 'jackpot') {
        winnings = result.reward.amount * (result.reward.multiplier || 1);
        rewardType = 'coins';
        rewardAmount = winnings;
      } else {
        winnings = result.reward.amount;
      }

      const game: RouletteGame = {
        id: `roulette_${Date.now()}`,
        userId: state.stats.userId,
        timestamp: new Date(),
        result,
        cost,
        consecutiveWins: state.stats.consecutiveWins + 1,
        totalWinnings: winnings,
      };

      await rouletteService.saveGame(game);

      const newStats: RouletteStats = {
        ...state.stats,
        totalSpins: state.stats.totalSpins + 1,
        totalWinnings: state.stats.totalWinnings + winnings,
        consecutiveWins: state.stats.consecutiveWins + 1,
        lastSpinDate: new Date(),
        freeSpinsRemaining: hasFreeSpin ? state.stats.freeSpinsRemaining - 1 : 0,
        bestWin: winnings > state.stats.bestWin.amount ? { type: rewardType, amount: rewardAmount } : state.stats.bestWin,
        averageWin: (state.stats.totalWinnings + winnings) / (state.stats.totalSpins + 1),
      };

      if (cost > 0) {
        try {
          await gameService.updatePlayerStats(state.stats.userId, {
            coins: gameStore.player.coins - cost
          });
          gameStore.addCoins(-cost);
        } catch (error) {
          console.error('Error deducting cost from Firebase:', error);
        }
      }

      await rouletteService.updateStats(state.stats.userId, newStats);

      try {
        if (rewardType === 'coins') {
          await gameService.updatePlayerStats(state.stats.userId, {
            coins: gameStore.player.coins + rewardAmount
          });
          gameStore.addCoins(rewardAmount);
        } else if (rewardType === 'experience') {
          await gameService.addExperience(state.stats.userId, rewardAmount);
          gameStore.addExperience(rewardAmount);
        } else if (rewardType === 'urinations') {
          await gameService.updatePlayerStats(state.stats.userId, {
            maxDailyUrinations: gameStore.player.maxDailyUrinations + rewardAmount
          });
          gameStore.addDailyUrinations(rewardAmount);
        } else if (rewardType === 'radius') {
          await gameService.updatePlayerStats(state.stats.userId, {
            territoryRadius: gameStore.player.territoryRadius + rewardAmount
          });
          gameStore.addTerritoryRadius(rewardAmount);
        }
      } catch (error) {
        console.error('Error updating Firebase with rewards:', error);
      }

      set({
        lastResult: result,
        stats: newStats,
        history: [game, ...state.history.slice(0, 9)],
        canSpin: newStats.freeSpinsRemaining > 0 || gameStore.player.coins >= config.spinCost,
      });

      return result;
    } catch (error) {
      console.error('Error spinning wheel:', error);
      set({ isSpinning: false });
      return null;
    }
  },

  resetSpinning: () => {
    set({ isSpinning: false });
  },

  loadHistory: async (userId: string) => {
    try {
      const history = await rouletteService.getHistory(userId, 10);
      set({ history });
    } catch (error) {
      console.error('Error loading roulette history:', error);
    }
  },

  checkDailyReset: async (userId: string) => {
    const state = get();
    const today = new Date().toDateString();
    const lastSpinDate = state.stats.lastSpinDate.toDateString();
    
    if (today !== lastSpinDate) {
      await rouletteService.resetDailySpins(userId);
      const config = rouletteService.getConfig();
      const gameStore = useGameStore.getState();
      
      set({
        stats: {
          ...state.stats,
          freeSpinsRemaining: config.freeSpinsPerDay,
          lastSpinDate: new Date(),
        },
        canSpin: config.freeSpinsPerDay > 0 || gameStore.player.coins >= config.spinCost,
      });
    }
  },
}));