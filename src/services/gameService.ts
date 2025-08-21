import { Achievement, Clan, GameState, Minigame, PlayerStats, Skin, Territory } from '@/src/types/game';
import { gameRepository } from './gameRepository';

export interface IGameService {
  // Player management
  initializePlayer: (userId: string, initialStats?: Partial<PlayerStats>) => Promise<void>;
  getPlayerStats: (userId: string) => Promise<PlayerStats | null>;
  updatePlayerStats: (userId: string, updates: Partial<PlayerStats>) => Promise<void>;
  addExperience: (userId: string, amount: number) => Promise<void>;
  levelUp: (userId: string) => Promise<void>;
  resetDailyUrinations: (userId: string) => Promise<void>;

  // Territory management
  markTerritory: (userId: string, latitude: number, longitude: number, radius: number, color: string) => Promise<Territory>;
  getPlayerTerritories: (userId: string) => Promise<Territory[]>;
  getAllTerritories: () => Promise<Territory[]>;
  deleteTerritory: (territoryId: string) => Promise<void>;
  getTerritoriesInRadius: (latitude: number, longitude: number, radius: number) => Promise<Territory[]>;

  // Minigame management
  getMinigames: (userId: string) => Promise<Minigame[]>;
  completeMinigame: (userId: string, minigameId: string) => Promise<void>;
  unlockMinigame: (userId: string, minigameId: string) => Promise<void>;

  // Achievement management
  getAchievements: (userId: string) => Promise<Achievement[]>;
  checkAndUpdateAchievements: (userId: string, playerStats: PlayerStats, territories: Territory[]) => Promise<void>;
  unlockAchievement: (userId: string, achievementId: string) => Promise<void>;

  // Skin management
  getSkins: (userId: string) => Promise<Skin[]>;
  purchaseSkin: (userId: string, skinId: string, price: number) => Promise<boolean>;
  equipSkin: (userId: string, skinId: string) => Promise<void>;

  // Clan management
  createClan: (userId: string, clanData: Omit<Clan, 'id'>) => Promise<Clan>;
  joinClan: (userId: string, clanId: string) => Promise<void>;
  leaveClan: (userId: string) => Promise<void>;
  getPublicClans: () => Promise<Clan[]>;
  getClanInfo: (clanId: string) => Promise<Clan | null>;

  // Game state management
  getGameState: (userId: string) => Promise<GameState | null>;
  saveGameState: (userId: string, gameState: GameState) => Promise<void>;
  updateGameSettings: (userId: string, settings: GameState['settings']) => Promise<void>;

  // Leaderboards
  getLeaderboard: (type: 'territories' | 'level' | 'coins') => Promise<{ userId: string; value: number; displayName: string }[]>;
  updateLeaderboardScore: (userId: string, type: 'territories' | 'level' | 'coins', value: number) => Promise<void>;

  // Real-time subscriptions
  subscribeToPlayerStats: (userId: string, callback: (stats: PlayerStats | null) => void) => () => void;
  subscribeToTerritories: (callback: (territories: Territory[]) => void) => () => void;
  subscribeToPlayerTerritories: (userId: string, callback: (territories: Territory[]) => void) => () => void;
  subscribeToGameState: (userId: string, callback: (gameState: GameState | null) => void) => () => void;
}

export class GameService implements IGameService {
  // Player management
  async initializePlayer(userId: string, initialStats?: Partial<PlayerStats>): Promise<void> {
    const defaultStats: PlayerStats = {
      level: 1,
      dailyUrinations: 0,
      maxDailyUrinations: 4,
      territoryRadius: 50,
      totalTerritory: 0,
      coins: 0,
      experience: 0,
      experienceToNextLevel: 100,
      ...initialStats,
    };

    await gameRepository.createPlayer(userId, defaultStats);
  }

  async getPlayerStats(userId: string): Promise<PlayerStats | null> {
    return await gameRepository.getPlayer(userId);
  }

  async updatePlayerStats(userId: string, updates: Partial<PlayerStats>): Promise<void> {
    await gameRepository.updatePlayer(userId, updates);
  }

  async addExperience(userId: string, amount: number): Promise<void> {
    const currentStats = await this.getPlayerStats(userId);
    if (!currentStats) return;

    const newExperience = currentStats.experience + amount;
    let newLevel = currentStats.level;
    let experienceToNextLevel = currentStats.experienceToNextLevel;
    let maxDailyUrinations = currentStats.maxDailyUrinations;

    // Check for level up
    if (newExperience >= experienceToNextLevel) {
      newLevel++;
      experienceToNextLevel = newLevel * 100;
      maxDailyUrinations += 1; // Increase daily urinations on level up
    }

    await this.updatePlayerStats(userId, {
      experience: newExperience,
      level: newLevel,
      experienceToNextLevel,
      maxDailyUrinations,
    });

    // Update leaderboard
    await this.updateLeaderboardScore(userId, 'level', newLevel);
  }

  async levelUp(userId: string): Promise<void> {
    const currentStats = await this.getPlayerStats(userId);
    if (!currentStats) return;

    const newLevel = currentStats.level + 1;
    const experienceToNextLevel = newLevel * 100;
    const maxDailyUrinations = currentStats.maxDailyUrinations + 1;

    await this.updatePlayerStats(userId, {
      level: newLevel,
      experienceToNextLevel,
      maxDailyUrinations,
    });

    await this.updateLeaderboardScore(userId, 'level', newLevel);
  }

  async resetDailyUrinations(userId: string): Promise<void> {
    await this.updatePlayerStats(userId, { dailyUrinations: 0 });
  }

  // Territory management
  async markTerritory(userId: string, latitude: number, longitude: number, radius: number, color: string, userDisplayName?: string, userColor?: string): Promise<Territory> {
    const currentStats = await this.getPlayerStats(userId);
    if (!currentStats) {
      throw new Error('Player not found');
    }

    if (currentStats.dailyUrinations >= currentStats.maxDailyUrinations) {
      throw new Error('Daily urination limit reached');
    }

    // Get user data for territory owner info
    const userData = await this.getUserData(userId);

    // Create territory with owner information
    const territory = await gameRepository.createTerritory({
      playerId: userId,
      latitude,
      longitude,
      radius,
      color,
      type: this.getTerritoryType(radius),
      owner: userData ? {
        uid: userId,
        displayName: userDisplayName || userData.displayName || 'Unknown Player',
        photoURL: userData.photoURL,
        email: userData.email || '',
        color: userColor || userData.color || color, // Use provided color, user's color, or territory color as fallback
      } : null,
    });

    // Update player stats
    await this.updatePlayerStats(userId, {
      dailyUrinations: currentStats.dailyUrinations + 1,
      totalTerritory: currentStats.totalTerritory + 1,
    });

    // Add experience
    await this.addExperience(userId, 10);

    // Update leaderboards
    await this.updateLeaderboardScore(userId, 'territories', currentStats.totalTerritory + 1);

    return territory;
  }

  async getPlayerTerritories(userId: string): Promise<Territory[]> {
    return await gameRepository.getPlayerTerritories(userId);
  }

  async getUserData(userId: string): Promise<{ displayName: string | null; photoURL: string | null; email: string | null; color: string | null } | null> {
    return await gameRepository.getUserData(userId);
  }

  async getAllTerritories(): Promise<Territory[]> {
    return await gameRepository.getAllTerritories();
  }

  async deleteTerritory(territoryId: string): Promise<void> {
    await gameRepository.deleteTerritory(territoryId);
  }

  async getTerritoriesInRadius(latitude: number, longitude: number, radius: number): Promise<Territory[]> {
    const allTerritories = await this.getAllTerritories();
    
    return allTerritories.filter(territory => {
      const distance = this.calculateDistance(
        latitude, longitude,
        territory.latitude, territory.longitude
      );
      return distance <= radius;
    });
  }

  // Minigame management
  async getMinigames(userId: string): Promise<Minigame[]> {
    return await gameRepository.getMinigames(userId);
  }

  async completeMinigame(userId: string, minigameId: string): Promise<void> {
    const minigames = await this.getMinigames(userId);
    const minigame = minigames.find(m => m.id === minigameId);
    
    if (!minigame || !minigame.isUnlocked) {
      throw new Error('Minigame not available');
    }

    const currentStats = await this.getPlayerStats(userId);
    if (!currentStats) return;

    // Apply reward
    const updates: Partial<PlayerStats> = {};
    
    switch (minigame.reward.type) {
      case 'urinations':
        updates.maxDailyUrinations = currentStats.maxDailyUrinations + minigame.reward.amount;
        break;
      case 'radius':
        updates.territoryRadius = currentStats.territoryRadius + minigame.reward.amount;
        break;
      case 'coins':
        updates.coins = currentStats.coins + minigame.reward.amount;
        await this.updateLeaderboardScore(userId, 'coins', currentStats.coins + minigame.reward.amount);
        break;
    }

    await this.updatePlayerStats(userId, updates);
    await this.addExperience(userId, 20);
  }

  async unlockMinigame(userId: string, minigameId: string): Promise<void> {
    await gameRepository.unlockMinigame(userId, minigameId);
  }

  // Achievement management
  async getAchievements(userId: string): Promise<Achievement[]> {
    return await gameRepository.getAchievements(userId);
  }

  async checkAndUpdateAchievements(userId: string, playerStats: PlayerStats, territories: Territory[]): Promise<void> {
    const achievements = await this.getAchievements(userId);
    
    for (const achievement of achievements) {
      if (achievement.isUnlocked) continue;

      let newProgress = achievement.progress;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-territory':
          newProgress = territories.length > 0 ? 1 : 0;
          shouldUnlock = newProgress >= achievement.maxProgress;
          break;
        case 'territory-master':
          newProgress = Math.min(territories.length, achievement.maxProgress);
          shouldUnlock = newProgress >= achievement.maxProgress;
          break;
        case 'level-5':
          newProgress = Math.min(playerStats.level, achievement.maxProgress);
          shouldUnlock = newProgress >= achievement.maxProgress;
          break;
        case 'rich-dog':
          newProgress = Math.min(playerStats.coins, achievement.maxProgress);
          shouldUnlock = newProgress >= achievement.maxProgress;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        
        // Apply achievement reward
        const updates: Partial<PlayerStats> = {};
        switch (achievement.reward.type) {
          case 'coins':
            updates.coins = playerStats.coins + achievement.reward.amount;
            break;
          case 'urinations':
            updates.maxDailyUrinations = playerStats.maxDailyUrinations + achievement.reward.amount;
            break;
        }
        
        if (Object.keys(updates).length > 0) {
          await this.updatePlayerStats(userId, updates);
        }
        
        await this.addExperience(userId, 50);
      } else if (newProgress !== achievement.progress) {
        await gameRepository.updateAchievement(userId, achievement.id, { progress: newProgress });
      }
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await gameRepository.unlockAchievement(userId, achievementId);
  }

  // Skin management
  async getSkins(userId: string): Promise<Skin[]> {
    return await gameRepository.getSkins(userId);
  }

  async purchaseSkin(userId: string, skinId: string, price: number): Promise<boolean> {
    const currentStats = await this.getPlayerStats(userId);
    if (!currentStats || currentStats.coins < price) {
      return false;
    }

    await this.updatePlayerStats(userId, { coins: currentStats.coins - price });
    await gameRepository.purchaseSkin(userId, skinId);
    
    await this.updateLeaderboardScore(userId, 'coins', currentStats.coins - price);
    return true;
  }

  async equipSkin(userId: string, skinId: string): Promise<void> {
    await gameRepository.updateSkin(userId, skinId, { isEquipped: true });
  }

  // Clan management
  async createClan(userId: string, clanData: Omit<Clan, 'id'>): Promise<Clan> {
    const clan = await gameRepository.createClan(clanData);
    await this.joinClan(userId, clan.id);
    return clan;
  }

  async joinClan(userId: string, clanId: string): Promise<void> {
    await gameRepository.joinClan(userId, clanId);
  }

  async leaveClan(userId: string): Promise<void> {
    await gameRepository.leaveClan(userId);
  }

  async getPublicClans(): Promise<Clan[]> {
    return await gameRepository.getPublicClans();
  }

  async getClanInfo(clanId: string): Promise<Clan | null> {
    return await gameRepository.getClan(clanId);
  }

  // Game state management
  async getGameState(userId: string): Promise<GameState | null> {
    return await gameRepository.getGameState(userId);
  }

  async saveGameState(userId: string, gameState: GameState): Promise<void> {
    await gameRepository.updateGameState(userId, gameState);
  }

  async updateGameSettings(userId: string, settings: GameState['settings']): Promise<void> {
    await gameRepository.updateGameState(userId, { settings });
  }

  // Leaderboards
  async getLeaderboard(type: 'territories' | 'level' | 'coins'): Promise<{ userId: string; value: number; displayName: string }[]> {
    return await gameRepository.getLeaderboard(type);
  }

  async updateLeaderboardScore(userId: string, type: 'territories' | 'level' | 'coins', value: number): Promise<void> {
    await gameRepository.updateLeaderboardScore(userId, type, value);
  }

  // Real-time subscriptions
  subscribeToPlayerStats(userId: string, callback: (stats: PlayerStats | null) => void) {
    return gameRepository.subscribeToPlayer(userId, callback);
  }

  subscribeToTerritories(callback: (territories: Territory[]) => void) {
    return gameRepository.subscribeToTerritories(callback);
  }

  subscribeToPlayerTerritories(userId: string, callback: (territories: Territory[]) => void) {
    return gameRepository.subscribeToPlayerTerritories(userId, callback);
  }

  subscribeToGameState(userId: string, callback: (gameState: GameState | null) => void) {
    return gameRepository.subscribeToGameState(userId, callback);
  }

  // Helper methods
  private getTerritoryType(radius: number): 'small' | 'medium' | 'large' {
    if (radius < 40) return 'small';
    if (radius < 80) return 'medium';
    return 'large';
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

// Export singleton instance
export const gameService = new GameService();
