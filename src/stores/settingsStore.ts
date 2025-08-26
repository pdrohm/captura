import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AppSettings {
  
  sound: boolean;
  haptics: boolean;
  notifications: boolean;

  darkMode: boolean;
  locationServices: boolean;
  autoSave: boolean;

  showTutorial: boolean;
  animationsEnabled: boolean;
  particleEffects: boolean;

  shareLocation: boolean;
  shareStats: boolean;
  allowAnalytics: boolean;
}

interface SettingsStore {
  settings: AppSettings;

  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleSetting: (setting: keyof AppSettings) => void;
  resetToDefaults: () => void;
  exportSettings: () => Promise<string>;
  importSettings: (settingsJson: string) => Promise<boolean>;
}

const DEFAULT_SETTINGS: AppSettings = {
  
  sound: true,
  haptics: true,
  notifications: true,

  darkMode: false,
  locationServices: true,
  autoSave: true,

  showTutorial: true,
  animationsEnabled: true,
  particleEffects: true,

  shareLocation: false,
  shareStats: false,
  allowAnalytics: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        }));
      },

      toggleSetting: (setting) => {
        set((state) => ({
          settings: {
            ...state.settings,
            [setting]: !state.settings[setting],
          },
        }));
      },

      resetToDefaults: () => {
        set({ settings: DEFAULT_SETTINGS });
      },

      exportSettings: async () => {
        const { settings } = get();
        return JSON.stringify(settings, null, 2);
      },

      importSettings: async (settingsJson) => {
        try {
          const importedSettings = JSON.parse(settingsJson) as Partial<AppSettings>;

          const validKeys = Object.keys(DEFAULT_SETTINGS) as (keyof AppSettings)[];
          const filteredSettings: Partial<AppSettings> = {};
          
          for (const key of validKeys) {
            if (key in importedSettings && typeof importedSettings[key] === typeof DEFAULT_SETTINGS[key]) {
              filteredSettings[key] = importedSettings[key];
            }
          }
          
          set((state) => ({
            settings: {
              ...state.settings,
              ...filteredSettings,
            },
          }));
          
          return true;
        } catch (error) {
          console.error('Failed to import settings:', error);
          return false;
        }
      },
    }),
    {
      name: 'dogeatdog-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);

export const useGameSettings = () => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const toggleSetting = useSettingsStore((state) => state.toggleSetting);
  
  return {
    sound: settings.sound,
    haptics: settings.haptics,
    notifications: settings.notifications,
    animationsEnabled: settings.animationsEnabled,
    particleEffects: settings.particleEffects,
    updateSettings,
    toggleSetting,
  };
};

export const useAppPreferences = () => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const toggleSetting = useSettingsStore((state) => state.toggleSetting);
  
  return {
    darkMode: settings.darkMode,
    locationServices: settings.locationServices,
    autoSave: settings.autoSave,
    showTutorial: settings.showTutorial,
    updateSettings,
    toggleSetting,
  };
};

export const usePrivacySettings = () => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const toggleSetting = useSettingsStore((state) => state.toggleSetting);
  
  return {
    shareLocation: settings.shareLocation,
    shareStats: settings.shareStats,
    allowAnalytics: settings.allowAnalytics,
    updateSettings,
    toggleSetting,
  };
};