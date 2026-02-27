import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DetectionResultScreen = ({ route, navigation }) => {
  const detections = route?.params?.detections;

  // Safety check
  if (!detections || detections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No Food Detected</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("MainTabs", { screen: "Home" })
          }
        >
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const food = detections[0]; // show first detected food

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="food" size={28} color="#4CAF50" />
        <Text style={styles.headerTitle}>Detection Result</Text>
      </View>

      {/* Food Name */}
      <Text style={styles.foodName}>{food.label.toUpperCase()}</Text>

      {/* Nutrition Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>{food.nutrition?.calories} kcal</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>{food.nutrition?.protein} g</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Carbohydrates</Text>
          <Text style={styles.value}>{food.nutrition?.carbs} g</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fat</Text>
          <Text style={styles.value}>{food.nutrition?.fat} g</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate("MainTabs", { screen: "Home" })
        }
      >
        <Text style={styles.primaryButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.secondaryButtonText}>Scan Another Food</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  foodName: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DetectionResultScreen;
