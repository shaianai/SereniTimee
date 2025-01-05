import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, getDocs, query, where, collection, orderBy, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebase'; // Adjust path as needed
import NavigationBar from './NavigationBar';
import SignOutComponent from './SignOutComponent';

export default function HomeScreen({ navigation }) {
  const [weeklyMoods, setWeeklyMoods] = useState(new Array(7).fill('⚪')); // Default to empty circles
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update the date and time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-PH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
      setCurrentTime(now.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }));
    }, 1000);

    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated. Redirecting to login.');
        navigation.navigate('Login'); // Redirect to login
        return;
      }

      try {
        const uid = currentUser.uid;
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserName(userDoc.data().fname); // Set user's name
        } else {
          Alert.alert('Error', 'User data not found in Firestore.');
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  useEffect(() => {
    const fetchMoods = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) return;

      try {
        const today = new Date();
        const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week
        const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(currentWeekStart);
          day.setDate(day.getDate() + i);
          return day.toLocaleString('en-US', { weekday: 'long' }).toLowerCase(); // Match Firestore data
        });

        const moodsMap = {};

        for (const day of daysOfWeek) {
          const dayQuery = query(
            collection(db, 'moodToday'),
            where('day', '==', day),
            where('uid', '==', currentUser.uid),
            orderBy('timestamp', 'desc'),
            limit(1)
          );

          const querySnapshot = await getDocs(dayQuery);

          if (!querySnapshot.empty) {
            const latestDoc = querySnapshot.docs[0].data();
            moodsMap[day] = latestDoc.mood;
          }
        }

        const moodEmojis = daysOfWeek.map((day) => {
          switch (moodsMap[day]) {
            case 'happy': return '😊';
            case 'excited': return '😃';
            case 'confused': return '😕';
            case 'sad': return '😢';
            case 'bored': return '😪';
            case 'sick': return '😷';
            case 'sleepy': return '🥱';
            case 'angry': return '😡';
            case 'stressed': return '😫';
            case 'relaxed': return '😌';
            case 'lazy': return '🦥';
            case 'grateful': return '🤗';
            default: return '⚪';
          }
        });

        setWeeklyMoods(moodEmojis);
      } catch (error) {
        console.error('Error fetching moods:', error);
      }
    };

    fetchMoods();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/1200x/d0/9d/51/d09d516bc713c188426125f8379690e3.jpg' }}
      style={styles.background}
    >
      {/* Sign Out Button */}
      <SignOutComponent navigation={navigation} styles={styles} />

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
        <Text style={styles.greetingText}>Good Evening, {userName}</Text>

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

        <View style={styles.topSection}>
        <Text style={styles.myWeekText}>{currentDate}</Text>
        <Text style={styles.dayText}>{currentTime}</Text>
        </View>
      </View>

      {/* Navigation Bar */}
      <NavigationBar navigation={navigation} style={styles} />
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
    //alignItems: 'center',
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
