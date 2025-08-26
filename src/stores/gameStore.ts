import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Achievement, GameState, Minigame, PlayerStats, Territory } from '../types/game';

const INITIAL_PLAYER_STATS: PlayerStats = {
  level: 1,
  dailyUrinations: 0,
  maxDailyUrinations: 4,
  territoryRadius: 50,
  totalTerritory: 0,
  coins: 0,
  experience: 0,
  experienceToNextLevel: 100,
};

const INITIAL_MINIGAMES: Minigame[] = [
  {
    id: 'roulette',
    name: 'Lucky Roulette',
    icon: '🎰',
    description: 'Spin the wheel for random rewards!',
    difficulty: 'easy',
    reward: { type: 'urinations', amount: 1 },
    isUnlocked: true,
  },
  // {
  //   id: 'tap-game',
  //   name: 'Speed Tapper',
  //   icon: '👆',
  //   description: 'Tap as fast as you can!',
  //   difficulty: 'medium',
  //   reward: { type: 'radius', amount: 5 },
  //   isUnlocked: true,
  // },
  // {
  //   id: 'puzzle',
  //   name: 'Territory Puzzle',
  //   icon: '🧩',
  //   description: 'Solve puzzles to unlock rewards',
  //   difficulty: 'hard',
  //   reward: { type: 'coins', amount: 50 },
  //   isUnlocked: false,
  // },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-territory',
    name: 'First Mark',
    description: 'Mark your first territory',
    icon: '🎯',
    isUnlocked: false,
    progress: 0,
    maxProgress: 1,
    reward: { type: 'coins', amount: 10 },
  },
  {
    id: 'territory-master',
    name: 'Territory Master',
    description: 'Mark 10 territories',
    icon: '👑',
    isUnlocked: false,
    progress: 0,
    maxProgress: 10,
    reward: { type: 'urinations', amount: 2 },
  },
];

const INITIAL_STATE: GameState = {
  player: INITIAL_PLAYER_STATS,
  territories: [],
  minigames: INITIAL_MINIGAMES,
  achievements: INITIAL_ACHIEVEMENTS,
  skins: [],
  settings: {
    sound: true,
    haptics: true,
    notifications: true,
  },
};

interface GameStore extends GameState {
  // Actions
  markTerritory: (latitude: number, longitude: number) => boolean;
  completeMinigame: (minigameId: string) => void;
  purchaseSkin: (skinId: string) => boolean;
  resetDailyUrinations: () => void;
  addExperience: (amount: number) => void;
  addCoins: (amount: number) => void;
  addDailyUrinations: (amount: number) => void;
  addTerritoryRadius: (amount: number) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  clearAllData: () => void;
  checkAchievements: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      markTerritory: (latitude: number, longitude: number) => {
        const state = get();
        
        if (state.player.dailyUrinations >= state.player.maxDailyUrinations) {
          return false;
        }

        const newTerritory: Territory = {
          id: `territory_${Date.now()}`,
          playerId: 'current_player',
          latitude,
          longitude,
          radius: state.player.territoryRadius,
          color: getRandomTerritoryColor(),
          createdAt: new Date(),
          type: getTerritoryType(state.player.territoryRadius),
        };

        set((state) => ({
          territories: [...state.territories, newTerritory],
          player: {
            ...state.player,
            dailyUrinations: state.player.dailyUrinations + 1,
            totalTerritory: state.player.totalTerritory + 1,
            experience: state.player.experience + 10,
          },
        }));

        get().addExperience(10);
        get().checkAchievements();
        return true;
      },

      completeMinigame: (minigameId: string) => {
        const currentState = get();
        const minigame = currentState.minigames.find(m => m.id === minigameId);
        
        if (!minigame || !minigame.isUnlocked) return;

        set((state) => ({
          player: {
            ...state.player,
            ...(minigame.reward.type === 'urinations' && {
              maxDailyUrinations: state.player.maxDailyUrinations + minigame.reward.amount
            }),
            ...(minigame.reward.type === 'radius' && {
              territoryRadius: state.player.territoryRadius + minigame.reward.amount
            }),
            ...(minigame.reward.type === 'coins' && {
              coins: state.player.coins + minigame.reward.amount
            }),
          },
        }));

        get().addExperience(20);
      },

      purchaseSkin: (skinId: string) => {
        const currentState = get();
        const skin = currentState.skins.find(s => s.id === skinId);
        
        if (!skin || skin.isOwned || currentState.player.coins < skin.price) {
          return false;
        }

        set((state) => ({
          player: {
            ...state.player,
            coins: state.player.coins - skin.price,
          },
          skins: state.skins.map(s => 
            s.id === skinId ? { ...s, isOwned: true } : s
          ),
        }));

        return true;
      },

      resetDailyUrinations: () => {
        set((state) => ({
          player: {
            ...state.player,
            dailyUrinations: 0,
          },
        }));
      },

      addExperience: (amount: number) => {
        set((state) => {
          const newExperience = state.player.experience + amount;
          let newLevel = state.player.level;
          let experienceToNextLevel = state.player.experienceToNextLevel;

          if (newExperience >= experienceToNextLevel) {
            newLevel++;
            experienceToNextLevel = newLevel * 100;
          }

          return {
            player: {
              ...state.player,
              experience: newExperience,
              level: newLevel,
              experienceToNextLevel,
              ...(newLevel > state.player.level && {
                maxDailyUrinations: state.player.maxDailyUrinations + 1,
              }),
            },
          };
        });
      },

      addCoins: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            coins: state.player.coins + amount,
          },
        }));
      },

      addDailyUrinations: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            maxDailyUrinations: state.player.maxDailyUrinations + amount,
          },
        }));
      },

      addTerritoryRadius: (amount: number) => {
        set((state) => ({
          player: {
            ...state.player,
            territoryRadius: state.player.territoryRadius + amount,
          },
        }));
      },

      checkAchievements: () => {
        set((currentState) => ({
          achievements: currentState.achievements.map(achievement => {
            if (achievement.isUnlocked) return achievement;

            let newProgress = achievement.progress;

            switch (achievement.id) {
              case 'first-territory':
                newProgress = currentState.territories.length > 0 ? 1 : 0;
                break;
              case 'territory-master':
                newProgress = Math.min(currentState.territories.length, 10);
                break;
            }

            const isUnlocked = newProgress >= achievement.maxProgress && !achievement.isUnlocked;

            if (isUnlocked) {
              // Apply achievement reward
              setTimeout(() => {
                set((currentState) => ({
                  player: {
                    ...currentState.player,
                    ...(achievement.reward.type === 'coins' && {
                      coins: currentState.player.coins + achievement.reward.amount
                    }),
                    ...(achievement.reward.type === 'urinations' && {
                      maxDailyUrinations: currentState.player.maxDailyUrinations + achievement.reward.amount
                    }),
                    experience: currentState.player.experience + 50,
                  },
                }));
              }, 100);
            }

            return {
              ...achievement,
              progress: newProgress,
              isUnlocked,
            };
          }),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      clearAllData: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: 'dogeatdog-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

// Helper functions
function getRandomTerritoryColor(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getTerritoryType(radius: number): 'small' | 'medium' | 'large' {
  if (radius < 40) return 'small';
  if (radius < 80) return 'medium';
  return 'large';
}

// Hook para reset diário (pode ser chamado no useEffect do App)
export const useDailyReset = () => {
  const resetDailyUrinations = useGameStore(state => state.resetDailyUrinations);
  
  const checkAndResetDaily = async () => {
    try {
      const lastReset = await AsyncStorage.getItem('lastDailyReset');
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        resetDailyUrinations();
        await AsyncStorage.setItem('lastDailyReset', today);
      }
    } catch (error) {
      console.log('Error checking daily reset:', error);
    }
  };
  
  return checkAndResetDaily;
};