import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '../stores/gameStore';

export const useDailyReset = () => {
  const resetDailyUrinations = useGameStore(state => state.resetDailyUrinations);
  
  useEffect(() => {
    const checkAndResetDaily = async () => {
      try {
        const lastReset = await AsyncStorage.getItem('lastDailyReset');
        const today = new Date().toDateString();
        
        if (lastReset !== today) {
          resetDailyUrinations();
          await AsyncStorage.setItem('lastDailyReset', today);
          console.log('Daily urinations reset!');
        }
      } catch (error) {
        console.log('Error checking daily reset:', error);
      }
    };

    checkAndResetDaily();
  }, [resetDailyUrinations]);
};