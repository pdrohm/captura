import analytics from '@react-native-firebase/analytics';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export interface IAuthService {
  onAuthStateChanged: (callback: (user: any) => void) => () => void;
  getCurrentUser: () => any;
  
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signInAnonymously: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserColor: (color: string) => Promise<void>;
  getUserData: (uid: string) => Promise<any>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export interface IFirestoreService {
  collection: (path: string) => any;
  doc: (path: string, id?: string) => any;
  
  add: (collection: string, data: any) => Promise<any>;
  set: (doc: string, data: any) => Promise<void>;
  update: (doc: string, data: any) => Promise<void>;
  delete: (doc: string) => Promise<void>;
  get: (doc: string) => Promise<any>;
  
  where: (field: string, operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', value: any) => any;
  orderBy: (field: string, direction?: 'asc' | 'desc') => any;
  limit: (count: number) => any;
}

export interface IStorageService {
  ref: (path: string) => any;
  uploadBytes: (ref: any, data: any, metadata?: any) => Promise<any>;
  getDownloadURL: (ref: any) => Promise<string>;
  delete: (ref: any) => Promise<void>;
}

export interface IAnalyticsService {
  logEvent: (eventName: string, parameters?: Record<string, any>) => void;
  setUserId: (userId: string) => void;
  setUserProperty: (name: string, value: string) => void;
}

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

  async signInWithEmail(email: string, password: string): Promise<any> {
    return this.auth().signInWithEmailAndPassword(email, password);
  }

  async signUpWithEmail(email: string, password: string): Promise<any> {
    return this.auth().createUserWithEmailAndPassword(email, password);
  }

  async signInAnonymously(): Promise<any> {
    return this.auth().signInAnonymously();
  }

  async signOut(): Promise<void> {
    return this.auth().signOut();
  }

  async resetPassword(email: string): Promise<void> {
    return this.auth().sendPasswordResetEmail(email);
  }

  async updateProfile(displayName: string, photoURL?: string): Promise<void> {
    const user = this.auth().currentUser;
    if (!user) {
      throw new Error('No user signed in');
    }

    await user.updateProfile({
      displayName,
      photoURL,
    });
  }

  async updateUserColor(color: string): Promise<void> {
    const user = this.auth().currentUser;
    if (!user) {
      throw new Error('No user signed in');
    }

    await firestore().collection('users').doc(user.uid).set({
      color,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  async getUserData(uid: string): Promise<any> {
    const doc = await firestore().collection('users').doc(uid).get();
    return doc.exists ? doc.data() : null;
  }

  async updateEmail(email: string): Promise<void> {
    const user = this.auth().currentUser;
    if (!user) {
      throw new Error('No user signed in');
    }

    await user.updateEmail(email);
  }

  async updatePassword(password: string): Promise<void> {
    const user = this.auth().currentUser;
    if (!user) {
      throw new Error('No user signed in');
    }

    await user.updatePassword(password);
  }

  async deleteAccount(): Promise<void> {
    const user = this.auth().currentUser;
    if (!user) {
      throw new Error('No user signed in');
    }

    await user.delete();
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

  doc(path: string, id?: string) {
    const collection = this.firestore().collection(path);
    return id ? collection.doc(id) : collection;
  }

  async add(collection: string, data: any): Promise<any> {
    return this.firestore().collection(collection).add(data);
  }

  async set(doc: string, data: any): Promise<void> {
    return this.firestore().collection(doc).doc().set(data);
  }

  async update(doc: string, data: any): Promise<void> {
    return this.firestore().collection(doc).doc().update(data);
  }

  async delete(doc: string): Promise<void> {
    return this.firestore().collection(doc).doc().delete();
  }

  async get(doc: string): Promise<any> {
    return this.firestore().collection(doc).doc().get();
  }

  where(field: string, operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', value: any) {
    return this.firestore().collection('').where(field, operator, value);
  }

  orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
    return this.firestore().collection('').orderBy(field, direction);
  }

  limit(count: number) {
    return this.firestore().collection('').limit(count);
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

  async uploadBytes(ref: any, data: any, metadata?: any): Promise<any> {
    return ref.put(data, metadata);
  }

  async getDownloadURL(ref: any): Promise<string> {
    return ref.getDownloadURL();
  }

  async delete(ref: any): Promise<void> {
    return ref.delete();
  }
}

export class FirebaseAnalyticsService implements IAnalyticsService {
  private analytics: typeof analytics;

  constructor() {
    this.analytics = analytics;
  }

  logEvent(eventName: string, parameters?: Record<string, any>): void {
    this.analytics().logEvent(eventName, parameters);
  }

  setUserId(userId: string): void {
    this.analytics().setUserId(userId);
  }

  setUserProperty(name: string, value: string): void {
    this.analytics().setUserProperty(name, value);
  }
}

export const authService = new FirebaseAuthService();
export const firestoreService = new FirebaseFirestoreService();
export const storageService = new FirebaseStorageService();
export const analyticsService = new FirebaseAnalyticsService();