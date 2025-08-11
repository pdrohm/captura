import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useAuthStore } from '@/src/stores/authStore';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export function useAuthListener() {
  const { auth } = useFirebase();
  const { setUser, setLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((firebaseUser: User | null) => {
      setUser(firebaseUser);
      setLoading(false);
      setIsInitialized(true);
    });

    return () => unsubscribe();
  }, [auth, setUser, setLoading]);

  return { isInitialized };
}
