import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "./firebase"; // Import the Firebase instance
import { LinearGradient } from 'expo-linear-gradient';

const auth = getAuth(app);

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate('MoodPicker'); // Redirect to HomeScreen
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <LinearGradient colors={['#6086b0','#214872', '#214872', '#6086b0', '#a3c5ea', '#dbecff' ]} style={styles.container}>
      <Text style={styles.title}>SereniTime</Text>
      <Text style={styles.subtitle}>Tagline</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color:'white',
    fontSize: 50,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    color:'white',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    
  },
  input: {
    borderWidth: 2,
    borderColor: '#213555',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  link: {
    color: '213555',
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#213555',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
