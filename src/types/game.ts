export interface PlayerStats {
  level: number;
  dailyUrinations: number;
  maxDailyUrinations: number;
  territoryRadius: number;
  totalTerritory: number;
  coins: number;
  experience: number;
  experienceToNextLevel: number;
}

export interface Territory {
  id: string;
  playerId: string;
  latitude: number;
  longitude: number;
  radius: number;
  color: string;
  createdAt: Date;
  type: 'small' | 'medium' | 'large';
}

export interface Minigame {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    type: 'urinations' | 'radius' | 'coins';
    amount: number;
  };
  isUnlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  reward: {
    type: 'coins' | 'experience' | 'urinations';
    amount: number;
  };
}

export interface Skin {
  id: string;
  name: string;
  type: 'dog' | 'territory';
  previewUrl: string;
  price: number;
  isOwned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  totalTerritory: number;
  level: number;
  isPublic: boolean;
}

export interface GameState {
  player: PlayerStats;
  territories: Territory[];
  minigames: Minigame[];
  achievements: Achievement[];
  skins: Skin[];
  currentClan?: Clan;
  settings: {
    sound: boolean;
    haptics: boolean;
    notifications: boolean;
  };
}