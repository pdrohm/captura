import { Achievement, Clan, GameState, Minigame, PlayerStats, Skin, Territory } from '@/src/types/game';
import firestore from '@react-native-firebase/firestore';

export interface IGameRepository {
  // Player data
  createPlayer: (userId: string, playerData: PlayerStats) => Promise<void>;
  getPlayer: (userId: string) => Promise<PlayerStats | null>;
  updatePlayer: (userId: string, updates: Partial<PlayerStats>) => Promise<void>;
  subscribeToPlayer: (userId: string, callback: (player: PlayerStats | null) => void) => () => void;

  // Territories
  createTerritory: (territory: Omit<Territory, 'id' | 'createdAt'>) => Promise<Territory>;
  getPlayerTerritories: (playerId: string) => Promise<Territory[]>;
  getAllTerritories: () => Promise<Territory[]>;
  deleteTerritory: (territoryId: string) => Promise<void>;
  subscribeToTerritories: (callback: (territories: Territory[]) => void) => () => void;
  subscribeToPlayerTerritories: (playerId: string, callback: (territories: Territory[]) => void) => () => void;

  // Minigames
  getMinigames: (userId: string) => Promise<Minigame[]>;
  updateMinigame: (userId: string, minigameId: string, updates: Partial<Minigame>) => Promise<void>;
  unlockMinigame: (userId: string, minigameId: string) => Promise<void>;

  // Achievements
  getAchievements: (userId: string) => Promise<Achievement[]>;
  updateAchievement: (userId: string, achievementId: string, updates: Partial<Achievement>) => Promise<void>;
  unlockAchievement: (userId: string, achievementId: string) => Promise<void>;

  // Skins
  getSkins: (userId: string) => Promise<Skin[]>;
  purchaseSkin: (userId: string, skinId: string) => Promise<void>;
  updateSkin: (userId: string, skinId: string, updates: Partial<Skin>) => Promise<void>;

  // Clans
  createClan: (clan: Omit<Clan, 'id'>) => Promise<Clan>;
  getClan: (clanId: string) => Promise<Clan | null>;
  updateClan: (clanId: string, updates: Partial<Clan>) => Promise<void>;
  joinClan: (userId: string, clanId: string) => Promise<void>;
  leaveClan: (userId: string) => Promise<void>;
  getPublicClans: () => Promise<Clan[]>;

  // Game state
  getGameState: (userId: string) => Promise<GameState | null>;
  updateGameState: (userId: string, updates: Partial<GameState>) => Promise<void>;
  subscribeToGameState: (userId: string, callback: (gameState: GameState | null) => void) => () => void;

  // Leaderboards
  getLeaderboard: (type: 'territories' | 'level' | 'coins') => Promise<{ userId: string; value: number; displayName: string }[]>;
  updateLeaderboardScore: (userId: string, type: 'territories' | 'level' | 'coins', value: number) => Promise<void>;
}

export class FirestoreGameRepository implements IGameRepository {
  private firestore: typeof firestore;

  constructor() {
    this.firestore = firestore;
  }

  // Player data methods
  async createPlayer(userId: string, playerData: PlayerStats): Promise<void> {
    try {
      await this.firestore()
        .collection('players')
        .doc(userId)
        .set({
          ...playerData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to create player:', error);
      throw new Error('Failed to create player');
    }
  }

  async getPlayer(userId: string): Promise<PlayerStats | null> {
    try {
      const doc = await this.firestore()
        .collection('players')
        .doc(userId)
        .get();

      if (!doc.exists) return null;
      return doc.data() as PlayerStats;
    } catch (error) {
      console.error('Failed to get player:', error);
      throw new Error('Failed to get player');
    }
  }

  async updatePlayer(userId: string, updates: Partial<PlayerStats>): Promise<void> {
    try {
      await this.firestore()
        .collection('players')
        .doc(userId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to update player:', error);
      throw new Error('Failed to update player');
    }
  }

  subscribeToPlayer(userId: string, callback: (player: PlayerStats | null) => void): () => void {
    return this.firestore()
      .collection('players')
      .doc(userId)
      .onSnapshot((docSnapshot) => {
        if (docSnapshot.exists()) {
          callback(docSnapshot.data() as PlayerStats);
        } else {
          callback(null);
        }
      });
  }

  // Territory methods
  async createTerritory(territoryData: Omit<Territory, 'id' | 'createdAt'>): Promise<Territory> {
    try {
      const territoryId = `territory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const territory: Territory = {
        ...territoryData,
        id: territoryId,
        createdAt: new Date(),
      };

      await this.firestore()
        .collection('territories')
        .doc(territoryId)
        .set({
          ...territory,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return territory;
    } catch (error) {
      console.error('Failed to create territory:', error);
      throw new Error('Failed to create territory');
    }
  }

  async getPlayerTerritories(playerId: string): Promise<Territory[]> {
    try {
      const snapshot = await this.firestore()
        .collection('territories')
        .where('playerId', '==', playerId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Territory[];
    } catch (error) {
      console.error('Failed to get player territories:', error);
      throw new Error('Failed to get player territories');
    }
  }

  async getAllTerritories(): Promise<Territory[]> {
    try {
      const snapshot = await this.firestore()
        .collection('territories')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Territory[];
    } catch (error) {
      console.error('Failed to get all territories:', error);
      throw new Error('Failed to get all territories');
    }
  }

  async deleteTerritory(territoryId: string): Promise<void> {
    try {
      await this.firestore()
        .collection('territories')
        .doc(territoryId)
        .delete();
    } catch (error) {
      console.error('Failed to delete territory:', error);
      throw new Error('Failed to delete territory');
    }
  }

  subscribeToTerritories(callback: (territories: Territory[]) => void): () => void {
    return this.firestore()
      .collection('territories')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const territories = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Territory[];
        callback(territories);
      });
  }

  subscribeToPlayerTerritories(playerId: string, callback: (territories: Territory[]) => void): () => void {
    return this.firestore()
      .collection('territories')
      .where('playerId', '==', playerId)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const territories = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Territory[];
        callback(territories);
      });
  }

  // Minigame methods
  async getMinigames(userId: string): Promise<Minigame[]> {
    try {
      const doc = await this.firestore()
        .collection('users')
        .doc(userId)
        .collection('minigames')
        .doc('progress')
        .get();

      if (!doc.exists) {
        // Return default minigames if none exist
        return [];
      }

      return doc.data()?.minigames || [];
    } catch (error) {
      console.error('Failed to get minigames:', error);
      throw new Error('Failed to get minigames');
    }
  }

  async updateMinigame(userId: string, minigameId: string, updates: Partial<Minigame>): Promise<void> {
    try {
      const docRef = this.firestore()
        .collection('users')
        .doc(userId)
        .collection('minigames')
        .doc('progress');

      const docSnapshot = await docRef.get();
      const currentMinigames = docSnapshot.exists() ? docSnapshot.data()?.minigames || [] : [];
      
      const updatedMinigames = currentMinigames.map((minigame: Minigame) =>
        minigame.id === minigameId ? { ...minigame, ...updates } : minigame
      );

      await docRef.set({ minigames: updatedMinigames });
    } catch (error) {
      console.error('Failed to update minigame:', error);
      throw new Error('Failed to update minigame');
    }
  }

  async unlockMinigame(userId: string, minigameId: string): Promise<void> {
    await this.updateMinigame(userId, minigameId, { isUnlocked: true });
  }

  // Achievement methods
  async getAchievements(userId: string): Promise<Achievement[]> {
    try {
      const docSnapshot = await this.firestore()
        .collection('users')
        .doc(userId)
        .collection('achievements')
        .doc('progress')
        .get();

      if (!docSnapshot.exists()) {
        return [];
      }

      return docSnapshot.data()?.achievements || [];
    } catch (error) {
      console.error('Failed to get achievements:', error);
      throw new Error('Failed to get achievements');
    }
  }

  async updateAchievement(userId: string, achievementId: string, updates: Partial<Achievement>): Promise<void> {
    try {
      const docRef = this.firestore()
        .collection('users')
        .doc(userId)
        .collection('achievements')
        .doc('progress');

      const doc = await docRef.get();
      const currentAchievements = doc.exists ? doc.data()?.achievements || [] : [];
      
      const updatedAchievements = currentAchievements.map((achievement: Achievement) =>
        achievement.id === achievementId ? { ...achievement, ...updates } : achievement
      );

      await docRef.set({ achievements: updatedAchievements });
    } catch (error) {
      console.error('Failed to update achievement:', error);
      throw new Error('Failed to update achievement');
    }
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    await this.updateAchievement(userId, achievementId, { isUnlocked: true });
  }

  // Skin methods
  async getSkins(userId: string): Promise<Skin[]> {
    try {
      const doc = await this.firestore()
        .collection('users')
        .doc(userId)
        .collection('skins')
        .doc('inventory')
        .get();

      if (!doc.exists) {
        return [];
      }

      return doc.data()?.skins || [];
    } catch (error) {
      console.error('Failed to get skins:', error);
      throw new Error('Failed to get skins');
    }
  }

  async purchaseSkin(userId: string, skinId: string): Promise<void> {
    try {
      const docRef = this.firestore()
        .collection('users')
        .doc(userId)
        .collection('skins')
        .doc('inventory');

      const doc = await docRef.get();
      const currentSkins = doc.exists ? doc.data()?.skins || [] : [];
      
      const updatedSkins = currentSkins.map((skin: Skin) =>
        skin.id === skinId ? { ...skin, isOwned: true } : skin
      );

      await docRef.set({ skins: updatedSkins });
    } catch (error) {
      console.error('Failed to purchase skin:', error);
      throw new Error('Failed to purchase skin');
    }
  }

  async updateSkin(userId: string, skinId: string, updates: Partial<Skin>): Promise<void> {
    try {
      const docRef = this.firestore()
        .collection('users')
        .doc(userId)
        .collection('skins')
        .doc('inventory');

      const doc = await docRef.get();
      const currentSkins = doc.exists ? doc.data()?.skins || [] : [];
      
      const updatedSkins = currentSkins.map((skin: Skin) =>
        skin.id === skinId ? { ...skin, ...updates } : skin
      );

      await docRef.set({ skins: updatedSkins });
    } catch (error) {
      console.error('Failed to update skin:', error);
      throw new Error('Failed to update skin');
    }
  }

  // Clan methods
  async createClan(clanData: Omit<Clan, 'id'>): Promise<Clan> {
    try {
      const clanId = `clan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clan: Clan = {
        ...clanData,
        id: clanId,
      };

      await this.firestore()
        .collection('clans')
        .doc(clanId)
        .set({
          ...clan,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      return clan;
    } catch (error) {
      console.error('Failed to create clan:', error);
      throw new Error('Failed to create clan');
    }
  }

  async getClan(clanId: string): Promise<Clan | null> {
    try {
      const doc = await this.firestore()
        .collection('clans')
        .doc(clanId)
        .get();

      if (!doc.exists) return null;
      return doc.data() as Clan;
    } catch (error) {
      console.error('Failed to get clan:', error);
      throw new Error('Failed to get clan');
    }
  }

  async updateClan(clanId: string, updates: Partial<Clan>): Promise<void> {
    try {
      await this.firestore()
        .collection('clans')
        .doc(clanId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to update clan:', error);
      throw new Error('Failed to update clan');
    }
  }

  async joinClan(userId: string, clanId: string): Promise<void> {
    try {
      await this.firestore()
        .collection('users')
        .doc(userId)
        .update({
          clanId,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to join clan:', error);
      throw new Error('Failed to join clan');
    }
  }

  async leaveClan(userId: string): Promise<void> {
    try {
      await this.firestore()
        .collection('users')
        .doc(userId)
        .update({
          clanId: firestore.FieldValue.delete(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to leave clan:', error);
      throw new Error('Failed to leave clan');
    }
  }

  async getPublicClans(): Promise<Clan[]> {
    try {
      const snapshot = await this.firestore()
        .collection('clans')
        .where('isPublic', '==', true)
        .orderBy('memberCount', 'desc')
        .limit(20)
        .get();

      return snapshot.docs.map(doc => doc.data() as Clan);
    } catch (error) {
      console.error('Failed to get public clans:', error);
      throw new Error('Failed to get public clans');
    }
  }

  // Game state methods
  async getGameState(userId: string): Promise<GameState | null> {
    try {
      const doc = await this.firestore()
        .collection('users')
        .doc(userId)
        .collection('gameState')
        .doc('current')
        .get();

      if (!doc.exists) return null;
      return doc.data() as GameState;
    } catch (error) {
      console.error('Failed to get game state:', error);
      throw new Error('Failed to get game state');
    }
  }

  async updateGameState(userId: string, updates: Partial<GameState>): Promise<void> {
    try {
      await this.firestore()
        .collection('users')
        .doc(userId)
        .collection('gameState')
        .doc('current')
        .set(updates, { merge: true });
    } catch (error) {
      console.error('Failed to update game state:', error);
      throw new Error('Failed to update game state');
    }
  }

  subscribeToGameState(userId: string, callback: (gameState: GameState | null) => void): () => void {
    return this.firestore()
      .collection('users')
      .doc(userId)
      .collection('gameState')
      .doc('current')
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data() as GameState);
        } else {
          callback(null);
        }
      });
  }

  // Leaderboard methods
  async getLeaderboard(type: 'territories' | 'level' | 'coins'): Promise<{ userId: string; value: number; displayName: string }[]> {
    try {
      const snapshot = await this.firestore()
        .collection('leaderboards')
        .doc(type)
        .collection('scores')
        .orderBy('value', 'desc')
        .limit(100)
        .get();

      return snapshot.docs.map(doc => doc.data() as { userId: string; value: number; displayName: string });
    } catch (error) {
      console.error('Failed to get leaderboard:', error);
      throw new Error('Failed to get leaderboard');
    }
  }

  async updateLeaderboardScore(userId: string, type: 'territories' | 'level' | 'coins', value: number): Promise<void> {
    try {
      // Get user display name
      const userDoc = await this.firestore()
        .collection('players')
        .doc(userId)
        .get();

      const displayName = userDoc.exists ? userDoc.data()?.displayName || 'Anonymous' : 'Anonymous';

      await this.firestore()
        .collection('leaderboards')
        .doc(type)
        .collection('scores')
        .doc(userId)
        .set({
          userId,
          value,
          displayName,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Failed to update leaderboard score:', error);
      throw new Error('Failed to update leaderboard score');
    }
  }
}

// Export singleton instance
export const gameRepository = new FirestoreGameRepository();
