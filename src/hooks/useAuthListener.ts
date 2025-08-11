import { useFirebase } from '@/src/contexts/FirebaseContext';
import { useAuthStore } from '@/src/stores/authStore';
import { useEffect } from 'react';

export const useAuthListener = () => {
  const { auth } = useFirebase();
  const { setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    console.log('useAuthListener: Setting up auth listener', { auth: !!auth });
    
    try {
      // Ensure Firebase auth is ready
      if (!auth) {
        console.warn('Firebase auth not available yet');
        return;
      }

      console.log('useAuthListener: Firebase auth is ready, setting up listener');
      
      const unsubscribe = auth.onAuthStateChanged((firebaseUser: any) => {
        console.log('useAuthListener: Auth state changed', { user: !!firebaseUser });
        try {
          if (firebaseUser) {
            // Transform Firebase user to our User interface
            const user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            };
            setUser(user);
          } else {
            setUser(null);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error processing auth state change:', error);
          setError('Authentication error occurred');
          setLoading(false);
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setError('Failed to initialize authentication');
      setLoading(false);
    }
  }, [auth, setUser, setLoading, setError]);
};
