import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearMinigameStorage = async () => {
  try {
    // Clear the entire game store to force a fresh sync
    await AsyncStorage.removeItem('dogeatdog-storage');
    console.log('Game storage cleared - minigames will be synced on next app restart');
  } catch (error) {
    console.error('Error clearing minigame storage:', error);
  }
};

export const debugMinigameSync = async () => {
  try {
    const stored = await AsyncStorage.getItem('dogeatdog-storage');
    if (stored) {
      const data = JSON.parse(stored);
      console.log('Current stored minigames:', data.state?.minigames);
    } else {
      console.log('No stored minigames found');
    }
  } catch (error) {
    console.error('Error debugging minigame sync:', error);
  }
};