import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from './firebase'; // Import your Firestore instance
import { collection, addDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const moodData = [
  { id: '1', mood: 'Happy', icon: 'emoticon-happy-outline' },
  { id: '2', mood: 'Excited', icon: 'emoticon-excited-outline' },
  { id: '3', mood: 'Confused', icon: 'emoticon-confused-outline' },
  { id: '4', mood: 'Sad', icon: 'emoticon-sad-outline' },
  { id: '5', mood: 'Bored', icon: 'emoticon-neutral-outline' },
  { id: '6', mood: 'Sick', icon: 'emoticon-sick-outline' },
  { id: '7', mood: 'Sleepy', icon: 'emoticon-dead-outline' },
  { id: '8', mood: 'Angry', icon: 'emoticon-angry-outline' },
  { id: '9', mood: 'Stressed', icon: 'emoticon-frown-outline' },
  { id: '10', mood: 'Relaxed', icon: 'emoticon-cool-outline' },
  { id: '11', mood: 'Lazy', icon: 'emoticon-outline' },
  { id: '12', mood: 'Grateful', icon: 'emoticon-kiss-outline' },
];

const MoodPicker = ({ navigation }) => {
  const handleMoodSelect = async (mood) => {
    const today = new Date();
    const day = today.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Get the day of the week
    const timestamp = new Date(); // Capture the timestamp when the mood is selected

    try {
      // Add a new document to Firestore, including the timestamp
      await addDoc(collection(db, 'moodToday'), {
        mood: mood.toLowerCase(),
        day,
        timestamp, // Add the timestamp field
      });

      console.log(`Mood "${mood}" saved for ${day}`);
      navigation.navigate('Home'); // Navigate to the Home screen after saving
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#dbecff', '#a3c5ea', '#6086b0', '#214872', '#6086b0']} style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <FlatList
        data={moodData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.moodButton}
            onPress={() => handleMoodSelect(item.mood)}
          >
            <MaterialCommunityIcons name={item.icon} size={40} color="#555" />
            <Text style={styles.moodText}>{item.mood}</Text>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef3fc',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent:'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 100,
    marginBottom: 10,
    color: '#333',
  },
  gridContainer: {
    justifyContent: 'center',
    bottom:10,
    top:100,
  },
  moodButton: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  moodText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
});

export default MoodPicker;
