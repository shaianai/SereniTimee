import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Timer({ navigation }) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [sessionName, setSessionName] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const startTimer = async () => {
    if (!sessionName.trim()) {
      Alert.alert('Error', 'Please enter a session name.');
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) {
      Alert.alert('Error', 'Please set a valid time.');
      return;
    }

    setIsRunning(true);
    setRemainingTime(totalSeconds);

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          saveSession();
          setIsRunning(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const saveSession = async () => {
    try {
      await addDoc(collection(db, 'sessions'), {
        name: sessionName,
        duration: `${hours}h ${minutes}m ${seconds}s`,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Session saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save session.');
    }
  };

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Timer</Text>

      <View style={styles.pickerContainer}>
        <Picker selectedValue={hours} onValueChange={(itemValue) => setHours(itemValue)} style={styles.picker}>
          {[...Array(24)].map((_, i) => (
            <Picker.Item key={i} label={formatTime(i)} value={i} />
          ))}
        </Picker>
        <Picker selectedValue={minutes} onValueChange={(itemValue) => setMinutes(itemValue)} style={styles.picker}>
          {[...Array(60)].map((_, i) => (
            <Picker.Item key={i} label={formatTime(i)} value={i} />
          ))}
        </Picker>
        <Picker selectedValue={seconds} onValueChange={(itemValue) => setSeconds(itemValue)} style={styles.picker}>
          {[...Array(60)].map((_, i) => (
            <Picker.Item key={i} label={formatTime(i)} value={i} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Session name"
        value={sessionName}
        onChangeText={setSessionName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={startTimer}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>{isRunning ? 'Running...' : 'Start Session'}</Text>
      </TouchableOpacity>

      {remainingTime !== null && (
        <Text style={styles.timerText}>
          {formatTime(Math.floor(remainingTime / 3600))}:
          {formatTime(Math.floor((remainingTime % 3600) / 60))}:
          {formatTime(remainingTime % 60)}
        </Text>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});
