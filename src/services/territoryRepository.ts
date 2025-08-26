import { Territory } from '@/src/types/domain';
import firestore from '@react-native-firebase/firestore';

export interface ITerritoryRepository {
  createTerritory(territory: Omit<Territory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Territory>;
  getUserTerritories(userId: string): Promise<Territory[]>;
  getTerritoryWithOwner(territoryId: string): Promise<Territory | null>;
  subscribeToTerritories(callback: (territories: Territory[]) => void): () => void;
  subscribeToUserTerritories(userId: string, callback: (territories: Territory[]) => void): () => void;
}

export class FirestoreTerritoryRepository implements ITerritoryRepository {
  private firestore: typeof firestore;

  constructor() {
    this.firestore = firestore;
  }

  async createTerritory(territoryData: Omit<Territory, 'id' | 'createdAt' | 'updatedAt'>): Promise<Territory> {
    const now = firestore.Timestamp.now();

    const sanitizedData = JSON.parse(JSON.stringify(territoryData));
    
    const territory: Territory = {
      ...sanitizedData,
      id: `territory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };

    await this.firestore()
      .collection('territories')
      .doc(territory.id)
      .set(territory);

    return territory;
  }

  async getUserTerritories(userId: string): Promise<Territory[]> {
    const snapshot = await this.firestore()
      .collection('territories')
      .where('assignedTo', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => doc.data() as Territory);
  }

  async getTerritoryWithOwner(territoryId: string): Promise<Territory | null> {
    const docRef = this.firestore().collection('territories').doc(territoryId);
    const docSnap = await docRef.get();

    if (docSnap.exists()) {
      const territory = docSnap.data() as Territory;

      if (territory.assignedTo) {
        try {
          const userDoc = await this.firestore().collection('users').doc(territory.assignedTo).get();
          if (userDoc.exists()) {
            const userData = userDoc.data();
            territory.owner = {
              uid: territory.assignedTo,
              displayName: userData?.displayName || null,
              photoURL: userData?.photoURL || null,
              email: userData?.email || '',
            };
          }
        } catch (error) {
          console.warn('Failed to fetch owner information:', error);
        }
      }
      
      return { ...territory, id: docSnap.id };
    }
    return null;
  }

  subscribeToTerritories(callback: (territories: Territory[]) => void): () => void {
    return this.firestore()
      .collection('territories')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const territories = snapshot.docs.map(doc => doc.data() as Territory);
        callback(territories);
      });
  }

  subscribeToUserTerritories(userId: string, callback: (territories: Territory[]) => void): () => void {
    return this.firestore()
      .collection('territories')
      .where('assignedTo', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const territories = snapshot.docs.map(doc => doc.data() as Territory);
        callback(territories);
      });
  }
}

export const territoryRepository = new FirestoreTerritoryRepository();