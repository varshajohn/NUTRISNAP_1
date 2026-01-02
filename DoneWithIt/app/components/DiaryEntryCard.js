// FILE: app/components/DiaryEntryCard.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const DiaryEntryCard = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <View style={styles.infoContainer}>
      <Text style={styles.foodName}>{item.name}</Text>
      <Text style={styles.calories}>{item.calories} kcal</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
    <View style={styles.macros}>
      <Text style={styles.macroText}>P: {item.protein}g</Text>
      <Text style={styles.macroText}>C: {item.carbs}g</Text>
      <Text style={styles.macroText}>F: {item.fats}g</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginVertical: 4,
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  macros: {
    alignItems: 'flex-end',
  },
  macroText: {
    fontSize: 12,
    color: '#555',
  },
});

export default DiaryEntryCard;