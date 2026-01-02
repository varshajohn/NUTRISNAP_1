import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import NutritionSummaryCard from '../components/NutritionSummaryCard';
import apiClient from '../../api/client';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user and summary data when the screen loads
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userData = await apiClient('user');
        const summaryData = await apiClient('todaySummary');
        setUser(userData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to fetch home screen data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCameraScan = () => navigation.navigate('Camera');
  const handleBarcodeScan = () => console.log('Barcode Scan Pressed');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NutriSnap</Text>
        {user && <Text style={styles.welcomeText}>Welcome, {user.name.split(' ')[0]}!</Text>}
      </View>

      {summary && (
        <NutritionSummaryCard
          calories={summary.calories}
          protein={summary.protein}
          carbs={summary.carbs}
          fats={summary.fats}
        />
      )}

      <View style={styles.actionContainer}>
        <Text style={styles.actionTitle}>Start Tracking Your Meal</Text>
        <TouchableOpacity style={styles.button} onPress={handleCameraScan}>
          <MaterialCommunityIcons name="camera" size={30} color="white" />
          <Text style={styles.buttonText}>Scan with Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleBarcodeScan}>
          <MaterialCommunityIcons name="barcode-scan" size={30} color="white" />
          <Text style={styles.buttonText}>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeText: {
    fontSize: 18,
    color: 'gray',
    marginTop: 5,
  },
  actionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#444',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});

export default HomeScreen;