import type {
    RouletteConfig,
    RouletteGame,
    RouletteResult,
    RouletteSegment,
    RouletteStats
} from '../types/roulette';
import { firestoreService } from './firebase';

export interface IRouletteService {
  // Game logic
  spinWheel: (userId: string, cost: number) => Promise<RouletteResult>;
  getRandomSegment: (segments: RouletteSegment[]) => RouletteSegment;
  
  // Firestore operations
  saveGame: (game: RouletteGame) => Promise<void>;
  getStats: (userId: string) => Promise<RouletteStats | null>;
  updateStats: (userId: string, stats: Partial<RouletteStats>) => Promise<void>;
  getHistory: (userId: string, limit?: number) => Promise<RouletteGame[]>;
  
  // Configuration
  getConfig: () => RouletteConfig;
  resetDailySpins: (userId: string) => Promise<void>;
}

export class RouletteService implements IRouletteService {
  private readonly config: RouletteConfig = {
    segments: [
      {
        id: 'coins-small',
        label: '10 Coins',
        icon: '🪙',
        color: '#FFD700',
        reward: { type: 'coins', amount: 10 },
        probability: 0.25,
      },
      {
        id: 'coins-medium',
        label: '25 Coins',
        icon: '🪙',
        color: '#FFA500',
        reward: { type: 'coins', amount: 25 },
        probability: 0.20,
      },
      {
        id: 'experience',
        label: '50 XP',
        icon: '⭐',
        color: '#4ECDC4',
        reward: { type: 'experience', amount: 50 },
        probability: 0.20,
      },
      {
        id: 'urinations',
        label: '+1 Pee',
        icon: '💧',
        color: '#45B7D1',
        reward: { type: 'urinations', amount: 1 },
        probability: 0.15,
      },
      {
        id: 'radius',
        label: '+5m Radius',
        icon: '📏',
        color: '#98D8C8',
        reward: { type: 'radius', amount: 5 },
        probability: 0.10,
      },
      {
        id: 'jackpot',
        label: 'JACKPOT!',
        icon: '🎰',
        color: '#FF6B6B',
        reward: { type: 'jackpot', amount: 100, multiplier: 3 },
        probability: 0.05,
      },
      {
        id: 'coins-large',
        label: '50 Coins',
        icon: '🪙',
        color: '#FF8C00',
        reward: { type: 'coins', amount: 50 },
        probability: 0.03,
      },
      {
        id: 'experience-large',
        label: '100 XP',
        icon: '⭐',
        color: '#00CED1',
        reward: { type: 'experience', amount: 100 },
        probability: 0.02,
      },
    ],
    spinCost: 10,
    freeSpinsPerDay: 1,
    maxConsecutiveWins: 10,
    jackpotThreshold: 5,
  };

  async spinWheel(userId: string, cost: number): Promise<RouletteResult> {
    const segment = this.getRandomSegment(this.config.segments);
    const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds
    const finalAngle = Math.random() * 360;

    return {
      segmentId: segment.id,
      reward: segment.reward,
      spinDuration,
      finalAngle,
    };
  }

  getRandomSegment(segments: RouletteSegment[]): RouletteSegment {
    const totalProbability = segments.reduce((sum, segment) => sum + segment.probability, 0);
    let random = Math.random() * totalProbability;
    
    for (const segment of segments) {
      random -= segment.probability;
      if (random <= 0) {
        return segment;
      }
    }
    
    // Fallback to first segment
    return segments[0];
  }

  async saveGame(game: RouletteGame): Promise<void> {
    try {
      await firestoreService.add('roulette_games', {
        ...game,
        timestamp: game.timestamp.toISOString(),
      });
    } catch (error) {
      console.error('Error saving roulette game:', error);
      throw new Error('Failed to save game result');
    }
  }

  async getStats(userId: string): Promise<RouletteStats | null> {
    try {
      const doc = await firestoreService.collection('user_roulette_stats').doc(userId).get();
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      return {
        userId,
        totalSpins: data?.totalSpins || 0,
        totalWinnings: data?.totalWinnings || 0,
        consecutiveWins: data?.consecutiveWins || 0,
        lastSpinDate: data?.lastSpinDate ? new Date(data.lastSpinDate) : new Date(),
        freeSpinsRemaining: data?.freeSpinsRemaining || this.config.freeSpinsPerDay,
        bestWin: data?.bestWin || { type: 'coins', amount: 0 },
        averageWin: data?.averageWin || 0,
      };
    } catch (error) {
      console.error('Error getting roulette stats:', error);
      throw new Error('Failed to get user stats');
    }
  }

  async updateStats(userId: string, stats: Partial<RouletteStats>): Promise<void> {
    try {
      const updateData: any = { ...stats };
      if (stats.lastSpinDate) {
        updateData.lastSpinDate = stats.lastSpinDate.toISOString();
      }
      
      await firestoreService.collection('user_roulette_stats').doc(userId).set(updateData, { merge: true });
    } catch (error) {
      console.error('Error updating roulette stats:', error);
      throw new Error('Failed to update user stats');
    }
  }

  async getHistory(userId: string, limit: number = 10): Promise<RouletteGame[]> {
    try {
      // Simplified query to avoid index requirements
      const snapshot = await firestoreService.collection('roulette_games').get();
      const games = snapshot.docs
        .map(doc => ({
          ...doc.data(),
          timestamp: new Date(doc.data().timestamp),
        }))
        .filter(game => game.userId === userId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit);
      
      return games as RouletteGame[];
    } catch (error) {
      console.error('Error getting roulette history:', error);
      throw new Error('Failed to get game history');
    }
  }

  getConfig(): RouletteConfig {
    return this.config;
  }

  async resetDailySpins(userId: string): Promise<void> {
    try {
      await this.updateStats(userId, {
        freeSpinsRemaining: this.config.freeSpinsPerDay,
        lastSpinDate: new Date(),
      });
    } catch (error) {
      console.error('Error resetting daily spins:', error);
      throw new Error('Failed to reset daily spins');
    }
  }
}

// Export service instance
export const rouletteService = new RouletteService();
