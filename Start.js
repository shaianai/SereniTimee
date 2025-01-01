import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';

export default function Start({ route, navigation }) {
  const { sessionName, totalSeconds } = route.params;
  const [quote, setQuote] = useState('');
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRandomQuote();
    const quoteInterval = setInterval(fetchRandomQuote, 10000);
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        } else {
          clearInterval(timerInterval);
          handleTimerFinish();
          return 0;
        }
      });
    }, 1000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const quotesSnapshot = await getDocs(collection(db, 'quotes'));
      const quotes = quotesSnapshot.docs.map((doc) => doc.data().quotes);

      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        showQuote(randomQuote);
      } else {
        showQuote('~~~~~~');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      showQuote('Failed to fetch quotes.');
    }
  };

  const showQuote = (newQuote) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setQuote(newQuote);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTimerFinish = () => {
    Alert.alert(
      'Nice Session!',
      'Your Session has ended, hope you felt some Serenity <3',
      [
        {
          text: 'love it',
          onPress: () => navigation.navigate('Timer'), // Redirect to Timer.js
        },
      ],
      { cancelable: false }
    );
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#dbecff', '#a3c5ea', '#6086b0', '#214872', '#010e1c']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{sessionName || 'Session Name'}</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Animated.Text style={[styles.quote, { opacity: fadeAnim }]}>
          {quote || '😊😊😊😊😊'}
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 20,
  },
});
