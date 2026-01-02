// FILE: app/screens/ProfileScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import InfoRow from '../components/InfoRow';
import TagList from '../components/TagList';
import apiClient from '../../api/client';

const ProfileScreen = ({ onLogout, userId }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // To refresh data when returning from Edit screen
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch user data by their real MongoDB ID
      const data = await apiClient(`user/${userId}`);
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) fetchData();
  }, [isFocused, userId]);

  const handleEditProfile = () => {
    // Pass the current user data to the edit screen
    navigation.navigate('EditProfile', { user });
  };

  const handleLogoutPress = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: onLogout },
    ]);
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <InfoRow icon="cake-variant-outline" label="Age" value={`${user.age} years`} />
          <InfoRow icon="human-male-height" label="Height" value={user.height} />
          <InfoRow icon="weight-kilogram" label="Weight" value={user.weight} />
          <InfoRow icon="flag-checkered" label="Primary Goal" value={user.goal} />
        </View>

        <View style={styles.healthContainer}>
          <TagList title="Allergies" data={user.allergies} />
          <TagList title="Health Conditions" data={user.conditions} />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <MaterialCommunityIcons name="logout" size={22} color="#d32f2f" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileHeader: { alignItems: 'center', paddingVertical: 30, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#4CAF50' },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#333' },
  email: { fontSize: 16, color: 'gray', marginTop: 5 },
  editButton: { marginTop: 20, backgroundColor: '#4CAF50', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 20 },
  editButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  detailsContainer: { backgroundColor: 'white', marginTop: 10, paddingHorizontal: 20 },
  healthContainer: { backgroundColor: 'white', marginTop: 10, paddingHorizontal: 20, paddingBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', paddingTop: 20, paddingBottom: 5 },
  logoutContainer: { paddingHorizontal: 20, marginTop: 30, marginBottom: 50 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffebee', paddingVertical: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ffcdd2' },
  logoutButtonText: { color: '#d32f2f', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});

export default ProfileScreen;