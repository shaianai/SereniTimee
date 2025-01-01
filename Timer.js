import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Checkbox from 'expo-checkbox'; // Import Checkbox from expo-checkbox
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Timer({ navigation }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

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

    navigation.navigate('Start', {
      sessionName,
      totalSeconds,
    });
  };

  const saveToFavorites = async () => {
    try {
      await addDoc(collection(db, 'favorites'), {
        name: sessionName,
        duration: `${hours}h ${minutes}m ${seconds}s`,
        createdAt: new Date(),
      });
      //Alert.alert('Success', 'Session added to favorites!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add session to favorites.');
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: 50,
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
  },
  button: {
    backgroundColor: '#a3c5ea',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
