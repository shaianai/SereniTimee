import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from './NavigationBar'; // Import the NavigationBar component

export default function Music({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Screen</Text>
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
