import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Import the Auth instance
import { LinearGradient } from 'expo-linear-gradient';
import { db } from './firebase'; // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setfName] = useState('');
  const [lname, setlName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !fname || !gender || !age) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Save additional user data in Firestore
      await setDoc(doc(db, "users", uid), {
        fname,
        lname,
        gender,
        age,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6086b0', '#214872', '#214872', '#6086b0', '#a3c5ea', '#dbecff']} style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={fname}
        onChangeText={setfName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lname}
        onChangeText={setlName}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
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
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing up..." : "Sign up"}</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate('Login')} style={styles.link}>
        Already have an account? Log in
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: {color: 'white', fontSize: 50, marginTop: 50, marginBottom: 50, textAlign: 'center' },
  input: { borderWidth: 2, borderColor: '#213555', backgroundColor: 'white', padding: 20, marginBottom: 20, borderRadius: 20 },
  link: { color: 'blue', marginTop: 15, textAlign: 'center' },
  button: { backgroundColor: '#213555', padding: 15, borderRadius: 40, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
