import React, { createContext, ReactNode, useContext, useEffect } from 'react';
import { IAnalyticsService, IAuthService, IFirestoreService, IStorageService } from '../services/firebase';

interface FirebaseContextType {
  auth: IAuthService;
  firestore: IFirestoreService;
  storage: IStorageService;
  analytics: IAnalyticsService;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  auth: IAuthService;
  firestore: IFirestoreService;
  storage: IStorageService;
  analytics: IAnalyticsService;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  auth,
  firestore,
  storage,
  analytics,
}) => {
  const value: FirebaseContextType = {
    auth,
    firestore,
    storage,
    analytics,
  };

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await firebaseServices.initialize();
        setServices(firebaseServices);
        setInitialized(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize Firebase services');
      }
    };

    initializeServices();
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
