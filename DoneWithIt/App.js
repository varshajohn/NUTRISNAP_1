import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null); // Store the MongoDB _id

  const handleLogin = (user) => {
    setUserId(user._id); // Save the ID from the database
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AppNavigator onLogout={handleLogout} userId={userId} />
      ) : (
        <AuthNavigator onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}