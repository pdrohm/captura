# Captura App Architecture

## Overview

This app uses a **hybrid architecture** that combines the best of multiple state management approaches:

- **Firebase Context**: For dependency injection of Firebase services
- **Zustand**: For authentication state management
- **React Context**: For theming and other app-wide configurations

## Architecture Components

### 1. Firebase Services Layer (`services/firebase.ts`)

**Purpose**: Provides a clean abstraction over Firebase SDKs with dependency injection support.

**Key Features**:
- Interface-based design (`IAuthService`, `IFirestoreService`, etc.)
- Dynamic imports to handle module loading issues
- Error handling and validation
- Type-safe method signatures

**Services**:
- `FirebaseAuthService`: Handles user authentication
- `FirebaseFirestoreService`: Manages database operations
- `FirebaseStorageService`: Handles file uploads/downloads
- `FirebaseAnalyticsService`: Tracks user behavior

### 2. Firebase Context (`contexts/FirebaseContext.tsx`)

**Purpose**: Provides Firebase services to the component tree via dependency injection.

**Benefits**:
- Easy to mock for testing
- Centralized service management
- Follows dependency injection principles

### 3. Zustand Auth Store (`stores/authStore.ts`)

**Purpose**: Manages authentication state using Zustand's lightweight state management.

**State**:
- `user`: Current authenticated user
- `loading`: Authentication operation status
- `error`: Error messages from auth operations

**Actions**:
- `signIn`: Email/password authentication
- `signUp`: User registration
- `signOut`: User logout
- `resetPassword`: Password reset
- `updateProfile`: Update user profile

**Benefits**:
- Lightweight and performant
- Built-in TypeScript support
- Easy state persistence
- Simple testing and mocking

### 4. Auth Listener Hook (`hooks/useAuthListener.ts`)

**Purpose**: Syncs Firebase authentication state with the Zustand store.

**How it works**:
- Listens to Firebase `onAuthStateChanged` events
- Transforms Firebase user objects to our User interface
- Updates Zustand store automatically
- Handles loading states

### 5. Authentication Components

**Components**:
- `AuthScreen`: Main container for auth flows
- `LoginForm`: Email/password login
- `RegisterForm`: User registration
- `ForgotPasswordForm`: Password reset
- `AuthNavigator`: Routes between auth and main app

**Features**:
- Form validation
- Error handling
- Loading states
- Responsive design

## Data Flow

```
Firebase SDK → Firebase Services → Firebase Context → Auth Listener → Zustand Store → UI Components
```

1. **Firebase SDK**: Native Firebase modules
2. **Firebase Services**: Business logic and error handling
3. **Firebase Context**: Service injection
4. **Auth Listener**: State synchronization
5. **Zustand Store**: State management
6. **UI Components**: React components using the store

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Services handle business logic
- Store manages state
- Components focus on UI
- Context provides dependencies

### 2. **Testability**
- Services can be easily mocked
- Store can be tested in isolation
- Components can be tested with mock stores

### 3. **Maintainability**
- Clear separation of responsibilities
- Easy to add new features
- Consistent error handling
- Type-safe interfaces

### 4. **Performance**
- Zustand is lightweight
- Minimal re-renders
- Efficient state updates

### 5. **Scalability**
- Easy to add new services
- Simple to extend state
- Clear patterns for new features

## Usage Examples

### Using Auth Store in Components

```typescript
import { useAuthStore } from '@/stores/authStore';
import { useFirebase } from '@/contexts/FirebaseContext';

function MyComponent() {
  const { user, signIn, loading } = useAuthStore();
  const { auth } = useFirebase();

  const handleLogin = async () => {
    try {
      await signIn(auth, 'user@example.com', 'password');
    } catch (error) {
      // Error is handled by the store
      console.log('Login failed');
    }
  };

  return (
    <View>
      {user ? (
        <Text>Welcome, {user.displayName}!</Text>
      ) : (
        <Button onPress={handleLogin} title="Sign In" />
      )}
    </View>
  );
}
```

### Adding New Services

```typescript
// 1. Define interface
interface INewService {
  doSomething(): Promise<void>;
}

// 2. Implement service
export class NewService implements INewService {
  async doSomething(): Promise<void> {
    // Implementation
  }
}

// 3. Add to Firebase Context
const FirebaseContext = createContext<FirebaseContextType>({
  // ... existing services
  newService: newService,
});

// 4. Use in components
const { newService } = useFirebase();
```

## Future Enhancements

### 1. **TanStack Query Integration**
- Add for data fetching and caching
- Separate from authentication state
- Handle server state separately from client state

### 2. **State Persistence**
- Add Zustand persist middleware
- Cache user preferences
- Offline support

### 3. **Error Boundaries**
- Add React Error Boundaries
- Better error handling
- User-friendly error messages

### 4. **Performance Monitoring**
- Add performance tracking
- Monitor state updates
- Optimize re-renders

## Best Practices

1. **Always use the store for state**: Don't create local state for auth-related data
2. **Handle errors gracefully**: Use the error state from the store
3. **Keep services focused**: Each service should have a single responsibility
4. **Use TypeScript**: Leverage type safety for better development experience
5. **Test thoroughly**: Mock services and test store logic independently

## Troubleshooting

### Common Issues

1. **Service not initialized**: Check if Firebase modules are loaded
2. **State not updating**: Verify the auth listener is working
3. **Type errors**: Ensure interfaces match implementations
4. **Performance issues**: Check for unnecessary re-renders

### Debug Tips

1. Use React DevTools to inspect Zustand store
2. Add console logs in the auth listener
3. Check Firebase console for authentication errors
4. Verify service initialization in constructors
