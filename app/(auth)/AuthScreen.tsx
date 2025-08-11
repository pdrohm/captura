import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ForgotPasswordForm from './ForgotPasswordForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  const switchToLogin = () => setMode('login');
  const switchToRegister = () => setMode('register');
  const switchToForgotPassword = () => setMode('forgot-password');

  return (
    <View style={styles.container}>
      {mode === 'login' && (
        <LoginForm
          onSwitchToRegister={switchToRegister}
          onForgotPassword={switchToForgotPassword}
        />
      )}
      
      {mode === 'register' && (
        <RegisterForm onSwitchToLogin={switchToLogin} />
      )}
      
      {mode === 'forgot-password' && (
        <ForgotPasswordForm onBackToLogin={switchToLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
