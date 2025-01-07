import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function NavigationBar({ navigation }) {
  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <FontAwesome name="home" size={50} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
        <FontAwesome name="bookmark" size={50} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Music')}>
        <FontAwesome name="music" size={50} color="#fff" />
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
    alignCItems:"center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly transparent black
    padding: 20,
  },
});
