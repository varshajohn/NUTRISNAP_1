// FILE: app/navigation/AppNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileNavigator from './ProfileNavigator';
import CameraScreen from '../screens/CameraScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = ({ onLogout, userId }) => (
  <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#4CAF50', tabBarInactiveTintColor: 'gray' }}>
    <Tab.Screen name="Home" component={HomeScreen} 
      options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} /> }} 
    />
    <Tab.Screen name="Diary" component={DiaryScreen} 
      options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="book-open-variant" color={color} size={size} /> }} 
    />
    <Tab.Screen name="Chat" component={ChatScreen} 
      options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="robot-happy-outline" color={color} size={size} /> }} 
    />
    <Tab.Screen name="Profile" options={{ headerShown: false, tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} /> }}>
      {() => <ProfileNavigator onLogout={onLogout} userId={userId} />}
    </Tab.Screen>
  </Tab.Navigator>
);

const AppNavigator = ({ onLogout, userId }) => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
      {() => <TabNavigator onLogout={onLogout} userId={userId} />}
    </Stack.Screen>
    <Stack.Screen name="Camera" component={CameraScreen} options={{ presentation: 'modal', headerShown: false }} />
  </Stack.Navigator>
);

export default AppNavigator;