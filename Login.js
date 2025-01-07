import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase'; // Import the Auth instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store UID locally
import { LinearGradient } from 'expo-linear-gradient';
import * as Google from 'expo-auth-session/providers/google';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    'BricolageGrotesque': require('./assets/fonts/BricolageGrotesque.ttf'),
  });

  // Ensure fonts are loaded before rendering
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '798229436880-udrtejuog2j8rrh8jkq9cu8imrhhb64o.apps.googleusercontent.com',
    androidClientId: '798229436880-udrtejuog2j8rrh8jkq9cu8imrhhb64o.apps.googleusercontent.com',
    iosClientId: '798229436880-udrtejuog2j8rrh8jkq9cu8imrhhb64o.apps.googleusercontent.com',
    webClientId: '798229436880-udrtejuog2j8rrh8jkq9cu8imrhhb64o.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const uid = userCredential.user.uid;

          // Store UID locally
          await AsyncStorage.setItem('uid', uid);

          Alert.alert('Success', 'Logged in with Google successfully!');
          navigation.navigate('MoodPicker');
        } catch (error) {
          Alert.alert('Google Login Failed', error.message);
        }
      }
    };

    handleGoogleResponse();
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store UID locally
      await AsyncStorage.setItem('uid', uid);

      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('MoodPicker');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6086b0', '#214872', '#214872', '#6086b0', '#a3c5ea', '#dbecff']} style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()} disabled={!request}>
        <View style={styles.googleButtonContent}>
          <Image
            source={{
              uri: 'https://pluspng.com/img-png/google-logo-png-open-2000.png',
            }}
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </View>
      </TouchableOpacity>

      <Text onPress={() => navigation.navigate('Signup')} style={styles.link}>
        Don't have an account? Sign up
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  googleButton: { backgroundColor: '#FFFFFF', padding: 15, borderRadius: 40, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  googleButtonContent: { flexDirection: 'row', alignItems: 'center' },
  googleLogo: { width: 20, height: 20, marginRight: 10 },
  googleButtonText: { color: '#757575', fontSize: 16, fontWeight: 'bold' },
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { color: 'white', fontSize: 50, fontFamily: 'BricolageGrotesque', marginBottom: 20, textAlign: 'center' },
  subtitle: { color: 'white', fontSize: 20, marginBottom: 20, textAlign: 'center', fontStyle: 'italic' },
  input: { borderWidth: 2, borderColor: '#213555', backgroundColor: 'white', padding: 20, marginBottom: 20, borderRadius: 20 },
  link: { color: '#213555', marginTop: 15, textAlign: 'center' },
  button: { backgroundColor: '#213555', padding: 15, borderRadius: 40, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 20, fontFamily: 'BricolageGrotesque', },
});
