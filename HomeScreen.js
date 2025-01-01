import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { doc, getDocs, query, where, collection, orderBy, limit } from 'firebase/firestore';

import { db } from './firebase'; // Adjust path as needed
import NavigationBar from './NavigationBar';

export default function HomeScreen({ navigation }) {
  const [weeklyMoods, setWeeklyMoods] = useState(new Array(7).fill('⚪')); // Default to empty circles

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const today = new Date();
        const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
        const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentWeekStart);
          day.setDate(day.getDate() + i);
          return day.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Use lowercase to match Firestore data
        });

        console.log('Days of the week to query:', daysOfWeek);

        // Log all documents in the 'moodToday' collection
        const allDocsSnapshot = await getDocs(collection(db, 'moodToday'));
        console.log('All Documents in moodToday:', allDocsSnapshot.docs.map((doc) => doc.data()));

        const moodsMap = {};

        for (const day of daysOfWeek) {
          console.log(`Fetching data for: ${day}`);

          // Full query with orderBy and limit
          const dayQuery = query(
            collection(db, 'moodToday'),
            where('day', '==', day),
            orderBy('timestamp', 'desc'),
            limit(1)
          );

          const querySnapshot = await getDocs(dayQuery);
          console.log(`QuerySnapshot for ${day}:`, querySnapshot.docs.map((doc) => doc.data()));

          // Test query without orderBy and limit
          const simpleQuery = query(
            collection(db, 'moodToday'),
            where('day', '==', day)
          );

          const simpleQuerySnapshot = await getDocs(simpleQuery);
          console.log(`QuerySnapshot without orderBy for ${day}:`, simpleQuerySnapshot.docs.map((doc) => doc.data()));

          if (!querySnapshot.empty) {
            const latestDoc = querySnapshot.docs[0].data();
            moodsMap[day] = latestDoc.mood; // Use the 'mood' field
            console.log(`Latest mood for ${day}:`, latestDoc.mood);
          } else {
            console.log(`No data found for ${day}`);
          }
        }

        const moodEmojis = daysOfWeek.map((day) => {
          switch (moodsMap[day]) {
            case 'happy':
              return '😊';
            case 'excited':
              return '😃';
            case 'confused':
              return '😕';
            case 'sad':
              return '😢';
              case 'bored':
              return '😪';
            case 'sick':
              return '😷';
            case 'sleepy':
              return '😌🥱';
            case 'angry':
              return '😡';
            case 'stressed':
              return '😫';
            case 'relaxed':
              return '😌';
            case 'lazy':
              return '🦥';
            case 'grateful':
              return '🤗';
            default:
              return '⚪';
          }
        });

        console.log('Final Mood Emojis:', moodEmojis);
        setWeeklyMoods(moodEmojis);
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, []);

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/1200x/d0/9d/51/d09d516bc713c188426125f8379690e3.jpg' }}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.myWeekText}>My week</Text>
          <Text style={styles.dayText}>Day 1 of 7</Text>
          <View style={styles.dots}>
            {weeklyMoods.map((mood, index) => (
              <Text key={index} style={styles.moodEmoji}>
                {mood}
              </Text>
            ))}
          </View>
        </View>

        {/* Greeting Section */}
        <Text style={styles.greetingText}>Good Evening, User</Text>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Timer')} style={styles.button}>
            <Text style={styles.buttonText}>Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Meditate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sleep</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Bar */}
        <NavigationBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'fff',
  },
  topSection: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 20,
  },
  myWeekText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  dayText: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 5,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 30,
    marginHorizontal: 4,
  },
  greetingText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
