// FILE: app/screens/EditProfileScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  SafeAreaView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppTextInput from '../components/AppTextInput';
import apiClient from '../../api/client';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  age: Yup.number().required().positive().integer().label('Age'),
  height: Yup.string().required().label('Height'),
  weight: Yup.string().required().label('Weight'),
});

const EditProfileScreen = ({ navigation, route }) => {
  const { user } = route.params;
  const [image, setImage] = useState(user.avatar);

  // Function to pick image from phone
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Lower quality to save space in DB
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async (values) => {
    try {
      // Include the new image URI in the values sent to backend
      const dataToSave = { ...values, avatar: image };
      
      await apiClient(`user/${user._id}`, 'PUT', dataToSave);
      
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Update Failed", "Could not connect to the server.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Formik
          initialValues={{
            name: user.name,
            age: String(user.age),
            height: user.height,
            weight: user.weight,
            goal: user.goal || '',
            allergies: Array.isArray(user.allergies) ? user.allergies.join(', ') : '',
            conditions: Array.isArray(user.conditions) ? user.conditions.join(', ') : '',
          }}
          onSubmit={handleSave}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              
              {/* IMAGE PICKER SECTION */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.avatar} />
                <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                  <MaterialCommunityIcons name="camera" size={20} color="white" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Name</Text>
              <AppTextInput onChangeText={handleChange('name')} value={values.name} />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <Text style={styles.label}>Age</Text>
              <AppTextInput onChangeText={handleChange('age')} value={values.age} keyboardType="numeric" />
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>Height</Text>
                  <AppTextInput onChangeText={handleChange('height')} value={values.height} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Weight</Text>
                  <AppTextInput onChangeText={handleChange('weight')} value={values.weight} />
                </View>
              </View>

              <Text style={styles.label}>Primary Goal</Text>
              <AppTextInput onChangeText={handleChange('goal')} value={values.goal} />

              <Text style={styles.label}>Allergies (comma-separated)</Text>
              <AppTextInput onChangeText={handleChange('allergies')} value={values.allergies} multiline />

              <Text style={styles.label}>Health Conditions</Text>
              <AppTextInput onChangeText={handleChange('conditions')} value={values.conditions} multiline />

              <View style={styles.buttonContainer}>
                <Button title="Save Changes" onPress={handleSubmit} color="#4CAF50" />
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  formContainer: { padding: 20 },
  imageContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eee' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: '38%',
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white'
  },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 10 },
  row: { flexDirection: 'row' },
  error: { color: 'red', fontSize: 12 },
  buttonContainer: { marginTop: 30, marginBottom: 50 },
});

export default EditProfileScreen;