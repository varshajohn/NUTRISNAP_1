// FILE: app/screens/CameraScreen.js (FINAL CORRECTED VERSION)

import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center', fontSize: 18 }}>
          We need your permission to use the camera
        </Text>
        <Button title={'Grant Permission'} onPress={requestPermission} />
      </View>
    );
  }

  const takePicture = async () => {
    try {
      // 1️⃣ Take photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });

      // 2️⃣ Create FormData
      const formData = new FormData();
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      // 3️⃣ Send to backend
      const response = await fetch(
        "http://172.20.10.5:3000/api/detect-food",
        {
          method: "POST",
          body: formData,
        }
      );

      // 4️⃣ Read response
      const data = await response.json();

      // 5️⃣ Safe handling (NO CHANGE)
      if (!data || !data.detections) {
        alert("Detection failed");
        return;
      }

      if (data.detections.length === 0) {
        alert("No food detected");
        return;
      }

      // ✅ FIX: pass detections (not foods)
      navigation.navigate('DetectionResult', {
        detections: data.detections,
      });

    } catch (error) {
      console.error(error);
      alert("Detection failed");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={'back'}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.innerButton} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="close" size={30} color="white" />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CameraScreen;
