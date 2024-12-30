import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from './NavigationBar'; // Import the NavigationBar component

export default function Favorites({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites Screen</Text>
      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
