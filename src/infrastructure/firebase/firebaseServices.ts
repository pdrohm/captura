import { IAnalyticsService, IAuthService, IFirestoreService, IStorageService } from '@/src/services/firebase';
import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export class FirebaseAuthService implements IAuthService {
  private auth: typeof auth;

  constructor() {
    this.auth = auth;
  }

  onAuthStateChanged(callback: (user: any) => void) {
    return this.auth().onAuthStateChanged(callback);
  }

  getCurrentUser() {
    return this.auth().currentUser;
  }

  signInWithEmail(email: string, password: string) {
    return this.auth().signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string) {
    return this.auth().createUserWithEmailAndPassword(email, password);
  }

  signInAnonymously() {
    return this.auth().signInAnonymously();
  }

  signOut() {
    return this.auth().signOut();
  }

  resetPassword(email: string) {
    return this.auth().sendPasswordResetEmail(email);
  }

  updateProfile(displayName: string, photoURL?: string) {
    const currentUser = this.auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    return currentUser.updateProfile({ displayName, photoURL });
  }

  updateEmail(email: string) {
    const currentUser = this.auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    return currentUser.updateEmail(email);
  }

  updatePassword(password: string) {
    const currentUser = this.auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    return currentUser.updatePassword(password);
  }

  deleteAccount() {
    const currentUser = this.auth().currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    return currentUser.delete();
  }
}

export class FirebaseFirestoreService implements IFirestoreService {
  private firestore: typeof firestore;

  constructor() {
    this.firestore = firestore;
  }

  collection(path: string) {
    return this.firestore().collection(path);
  }

  doc(path: string) {
    return this.firestore().doc(path);
  }

  add(collection: string, data: any) {
    return this.firestore().collection(collection).add(data);
  }

  set(doc: string, data: any, merge?: boolean) {
    return this.firestore().doc(doc).set(data, { merge });
  }

  update(doc: string, data: any) {
    return this.firestore().doc(doc).update(data);
  }

  delete(doc: string) {
    return this.firestore().doc(doc).delete();
  }

  get(doc: string) {
    return this.firestore().doc(doc).get();
  }

  where(field: string, operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', value: any) {
    return this.firestore().collection('').where(field, operator, value);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return this.firestore().collection('').orderBy(field, direction);
  }

  limit(limit: number) {
    return this.firestore().collection('').limit(limit);
  }

  onSnapshot(doc: string, callback: (doc: any) => void) {
    return this.firestore().doc(doc).onSnapshot(callback);
  }

  onSnapshotCollection(collection: string, callback: (snapshot: any) => void) {
    return this.firestore().collection(collection).onSnapshot(callback);
  }
}

export class FirebaseStorageService implements IStorageService {
  private storage: typeof storage;

  constructor() {
    this.storage = storage;
  }

  ref(path: string) {
    return this.storage().ref(path);
  }

  uploadBytes(ref: any, data: any, metadata?: any) {
    return ref.put(data, metadata);
  }

  getDownloadURL(ref: any) {
    return ref.getDownloadURL();
  }

  delete(ref: any) {
    return ref.delete();
  }

  listAll(ref: any) {
    return ref.listAll();
  }
}

export class FirebaseAnalyticsService implements IAnalyticsService {
  private analytics: typeof analytics;

  constructor() {
    this.analytics = analytics;
  }

  logEvent(eventName: string, parameters?: Record<string, any>) {
    return this.analytics().logEvent(eventName, parameters);
  }

  setUserId(userId: string) {
    return this.analytics().setUserId(userId);
  }

  setUserProperty(name: string, value: string) {
    return this.analytics().setUserProperty(name, value);
  }

  setCurrentScreen(screenName: string) {
    return this.analytics().logScreenView({
      screen_name: screenName,
      screen_class: screenName
    });
  }
}

// Export service instances
export const firebaseAuthService = new FirebaseAuthService();
export const firebaseFirestoreService = new FirebaseFirestoreService();
export const firebaseStorageService = new FirebaseStorageService();
export const firebaseAnalyticsService = new FirebaseAnalyticsService();
