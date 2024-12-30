import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function NavigationBar({ navigation }) {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesome name="home" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
        <FontAwesome name="bookmark" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Music')}>
        <FontAwesome name="music" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent black
    padding: 20,
  },
});
