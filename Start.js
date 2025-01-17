import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getDocs, collection } from 'firebase/firestore';
import { Audio } from 'expo-av';
import { db } from './firebase';

const musicFiles = {
  'piano.mp3': require('./assets/music/piano.mp3'),
  'nature.mp3': require('./assets/music/nature.mp3'),
  'focus.mp3': require('./assets/music/focus.mp3'),
};

export default function Start({ route, navigation }) {
  const { sessionName, totalSeconds, musicFile } = route.params;
  const [quote, setQuote] = useState('');
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const soundRef = useRef(null);  // Using useRef for sound to persist across renders
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimerFinish(); // Call handleTimerFinish directly
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      stopAndUnloadMusic(); // Ensure cleanup when component unmounts
    };
  }, []);

  // Fetch random quotes
  useEffect(() => {
    fetchRandomQuote();
    const quoteInterval = setInterval(fetchRandomQuote, 10000);
    return () => clearInterval(quoteInterval);
  }, []);

  // Fetch quotes from Firestore
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

  // Animate quote
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

  useEffect(() => {
    const loadMusic = async () => {
      try {
        if (musicFile && musicFiles[musicFile]) {
          console.log('Loading music:', musicFile);
          const { sound } = await Audio.Sound.createAsync(musicFiles[musicFile]);
          soundRef.current = sound; // Set the sound in the ref
          await sound.setIsLoopingAsync(true);
          await sound.playAsync();
          console.log('Music started playing');
        }
      } catch (error) {
        console.error('Error loading or playing music:', error);
      }
    };

    loadMusic();

    // Cleanup function to stop and unload music when the component unmounts
    return () => {
      if (soundRef.current) {
        stopAndUnloadMusic();  // Ensure the music is stopped
      }
    };
  }, [musicFile]);  // Make sure this useEffect runs when `musicFile` changes


  const stopAndUnloadMusic = async () => {
    console.log('Attempting to stop music...');
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;  // Clear the ref
        console.log('Sound stopped and unloaded');
      } catch (error) {
        console.error('Error stopping or unloading sound:', error);
      }
    } else {
      console.log('No sound to stop/unload');
    }
  };

  const handleTimerFinish = async () => {
    try {
      if (soundRef.current) {
        console.log('Stopping sound...');
        await soundRef.current.stopAsync();  // Stop the sound
        await soundRef.current.unloadAsync();  // Unload the sound
        console.log('Sound stopped and unloaded');
        soundRef.current = null;  // Clear the ref
      } else {
        console.log('No sound to stop');
      }

      Alert.alert(
        'Nice Session!',
        `Your session "${sessionName}" has ended. Hope you felt some Serenity ❤️`,
        [
          {
            text: 'Love it!',
            onPress: () => navigation.navigate('Timer'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error handling timer finish:', error);
    }
  };

  // Pause functionality
  const handlePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      soundRef.current = null;  // Stop music when paused
    }
  };

  // End session functionality
  const handleEndSession = () => {
    soundRef.current = null;  // Stop music when ending session
    Alert.alert(
      'End Session',
      'Are you sure you want to end the session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => navigation.navigate('Timer') },
      ]
    );
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#dbecff', '#a3c5ea', '#6086b0', '#214872', '#010e1c']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Session: {sessionName}</Text>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Animated.Text style={[styles.quote, { opacity: fadeAnim }]}>
          {quote || '😊😊😊😊😊'}
        </Animated.Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isPaused ? '#28a745' : '#213555' }]}
          onPress={() => setIsPaused((prev) => !prev)}
        >
          <Text style={styles.buttonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#213555' }]}
          onPress={() => {
            stopAndUnloadMusic();
            Alert.alert(
              'End Session',
              'Are you sure you want to end the session?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => navigation.navigate('Timer') },
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>End Session</Text>
        </TouchableOpacity>
        </View>
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
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 20,
    position: 'absolute',    // Use absolute positioning
    bottom: 0,               // Position it at the bottom
    left: 0,                 // Optional: ensures it's aligned with the left side of the screen
    right: 0,                // Optional: ensures it's aligned with the right side of the screen
  },  
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: '#fff',
  },
  timer: {
    fontSize: 64,
    color: '#fff',
    marginBottom: 30,
  },
  button: {
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#fff',
    marginHorizontal: 20,
  },
});
