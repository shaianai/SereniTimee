import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; // Adjust the path to your Firebase configuration
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignOutComponent({ navigation }) {
  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);

      // Clear the stored userId from AsyncStorage
      await AsyncStorage.removeItem('userId');
      Alert.alert('Success', 'You have been signed out.');

      // Optionally navigate to the Login screen
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    margin: 10,
  },
  signOutButton: {
    backgroundColor: '#213555',
    marginTop: 20,
    marginRight:10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  signOutText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
