import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useAuthStore } from '@/src/stores/authStore';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuthListener() {
  const { auth } = useFirebase();
  const { setUser, setLoading, loadUserData } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: User | null) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          await loadUserData(auth, firebaseUser.uid);
        } catch (error) {
          console.error('Failed to load user data:', error);
        }
      }
      
      setLoading(false);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [auth, setUser, setLoading, loadUserData]);

  return { isInitialized };
}
