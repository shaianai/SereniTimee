import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function Timer({ navigation }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState('');
  const [fontsLoaded] = useFonts({
    'BricolageGrotesque': require('./assets/fonts/BricolageGrotesque.ttf'),
  });

  const musicOptions = [
    { label: 'Choose Music Here', value: '' },
    { label: 'Relaxing Piano', value: 'piano.mp3' },
    { label: 'Nature Sounds', value: 'nature.mp3' },
    { label: 'Focus Beats', value: 'focus.mp3' },
  ];

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const startTimer = () => {
    if (!sessionName.trim()) {
      Alert.alert('Error', 'Please enter a session name.');
      return;
    }

    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);

    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please set a valid time greater than zero.');
      return;
    }

    if (isFavorite) {
      saveToFavorites();
    }

    saveToSessions(); // Save the session in the database
    const musicFile = selectedMusic || '';
    navigation.navigate('Start', {
      sessionName,
      totalSeconds,
      musicFile, // Pass the selected music to the Start screen
    });
    console.log('Starting timer with:', {
      sessionName,
      totalSeconds,
      musicFile: selectedMusic || 'None',
    });
    
  };

  const saveToFavorites = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save to favorites.');
      return;
    }

    const uid = user.uid;

    try {
      await addDoc(collection(db, 'favorites'), {
        name: sessionName,
        duration: `${hours}h ${minutes}m ${seconds}s`,
        music: selectedMusic || 'None',
        uid: uid,
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to add session to favorites.');
    }
  };

  const saveToSessions = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to save the session.');
      return;
    }

    const uid = user.uid;

    try {
      await addDoc(collection(db, 'sessions'), {
        name: sessionName,
        duration: `${hours}h ${minutes}m ${seconds}s`,
        music: selectedMusic || 'None',
        uid: uid,
        createdAt: new Date(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save session.');
    }
  };

  const formatTime = (time) => {
    const formatted = parseInt(time, 10);
    return isNaN(formatted) ? '00' : String(formatted).padStart(2, '0');
  };

  return (
    <LinearGradient
      colors={['#dbecff', '#a3c5ea', '#6086b0', '#214872', '#010e1c']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
      


        <Text style={styles.title}>Set Timer</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={String(hours)}
            onValueChange={(itemValue) => setHours(Number(itemValue))}
            style={styles.picker}
          >
            {[...Array(24)].map((_, i) => (
              <Picker.Item key={i} label={formatTime(i)} value={String(i)} />
            ))}
          </Picker>
          <Picker
            selectedValue={String(minutes)}
            onValueChange={(itemValue) => setMinutes(Number(itemValue))}
            style={styles.picker}
          >
            {[...Array(60)].map((_, i) => (
              <Picker.Item key={i} label={formatTime(i)} value={String(i)} />
            ))}
          </Picker>
          <Picker
            selectedValue={String(seconds)}
            onValueChange={(itemValue) => setSeconds(Number(itemValue))}
            style={styles.picker}
          >
            {[...Array(60)].map((_, i) => (
              <Picker.Item key={i} label={formatTime(i)} value={String(i)} />
            ))}
          </Picker>
        </View>
        <Picker
          selectedValue={selectedMusic}
          onValueChange={(itemValue) => setSelectedMusic(itemValue)}
          style={styles.musiccontainer}
        >
          {musicOptions.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} style={styles.Text} />
          ))}
        </Picker>
        

        <TextInput
          style={styles.input}
          placeholder="Session name"
          value={sessionName}
          onChangeText={setSessionName}
        />

        

        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isFavorite}
            onValueChange={setIsFavorite}
            color={isFavorite ? '#a3c5ea' : undefined}
          />
          <Text style={styles.checkboxLabel}>Add to Favorites</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={startTimer}
        >
          <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    fontFamily: 'BricolageGrotesque',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  musiccontainer: {
    justifyContent: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  picker: {
    flex: 1,
    height: 70,
    marginHorizontal: 5,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    fontFamily: 'BricolageGrotesque',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'BricolageGrotesque',
  },
  button: {
    backgroundColor: '#a3c5ea',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#213555',
    fontSize: 20,
    fontFamily: 'BricolageGrotesque',
  },
  Text: {
    color: '#213555',
    fontSize: 10,
    fontFamily: 'BricolageGrotesque',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'BricolageGrotesque',
  },
});
