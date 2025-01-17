import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import NavigationBar from './NavigationBar';
const musicFiles = {
  piano: require('./assets/music/piano.mp3'),
  nature: require('./assets/music/nature.mp3'),
  focus: require('./assets/music/focus.mp3'),
};

export default function Meditate({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBreathingGuideVisible, setBreathingGuideVisible] = useState(false);

  const soundRef = useRef(null);
  const breathingAnimation = useRef(new Animated.Value(1)).current;

  // Animated values for text opacity
  const inhaleOpacity = useRef(new Animated.Value(0)).current;
  const holdOpacity = useRef(new Animated.Value(0)).current;
  const exhaleOpacity = useRef(new Animated.Value(0)).current;

  // Handle music selection
  const handleMusicSelect = (musicKey) => {
    setSelectedMusic(musicFiles[musicKey]);
    setModalVisible(true);
  };

  // Start music and breathing guide
  const handleStart = async () => {
    if (selectedMusic) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(selectedMusic);
        soundRef.current = newSound;
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
        setIsPaused(false);
        setBreathingGuideVisible(true);
        startBreathingGuide(); // Start the breathing guide animation
      } catch (error) {
        console.error('Error playing music:', error);
      }
    }
    setModalVisible(false);
  };

  // Stop music
  const handleStop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsPaused(false);
      setBreathingGuideVisible(false);
    }

    Alert.alert(
      'Session Complete!',
      'Would you like to log your thoughts in the journal?',
      [
        { text: 'Not Now', style: 'cancel' },
        { text: 'Yes, Take Me There', onPress: () => navigation.navigate('Journal') },
      ],
      { cancelable: false }
    );
  };

  // Pause music
  const handlePause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPaused(true);
    }
  };

  // Breathing Guide Animation
  const startBreathingGuide = () => {
    Animated.loop(
      Animated.sequence([
        // Inhale: Expand the circle and show "Inhale"
        Animated.parallel([
          Animated.timing(breathingAnimation, {
            toValue: 1.5, // Expand the circle
            duration: 4000, // 4 seconds for inhale
            useNativeDriver: true,
          }),
          Animated.timing(inhaleOpacity, {
            toValue: 1, // Fade in "Inhale"
            duration: 500, // Fade in quickly
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(inhaleOpacity, {
          toValue: 0, // Fade out "Inhale"
          duration: 500, // Fade out after 4 seconds
          useNativeDriver: true,
        }),
  
        // Hold: Pause the circle and show "Hold"
        Animated.parallel([
          Animated.delay(4000), // Keep the circle expanded for 4 seconds
          Animated.timing(holdOpacity, {
            toValue: 1, // Fade in "Hold"
            duration: 500, // Fade in quickly
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(holdOpacity, {
          toValue: 0, // Fade out "Hold"
          duration: 500, // Fade out after 4 seconds
          useNativeDriver: true,
        }),
  
        // Exhale: Contract the circle and show "Exhale"
        Animated.parallel([
          Animated.timing(breathingAnimation, {
            toValue: 1, // Contract the circle
            duration: 4000, // 4 seconds for exhale
            useNativeDriver: true,
          }),
          Animated.timing(exhaleOpacity, {
            toValue: 1, // Fade in "Exhale"
            duration: 500, // Fade in quickly
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(exhaleOpacity, {
          toValue: 0, // Fade out "Exhale"
          duration: 500, // Fade out after 4 seconds
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  

  // Cleanup when unmounting
  useEffect(() => {
    return () => {
      handleStop(); // Stop everything on unmount
    };
  }, []);

  return (
    <LinearGradient colors={['#dbecff', '#a3c5ea']} style={styles.container}>
      <Text style={styles.title}>Meditate</Text>

      {/* Hide music list when a session is ongoing */}
      {!isPlaying && (
        <View style={styles.musicList}>
          {Object.keys(musicFiles).map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.musicButton}
              onPress={() => handleMusicSelect(key)}
            >
              <Text style={styles.musicButtonText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal for music details */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Relax with this music</Text>
            <Text style={styles.modalDescription}>
              This music helps calm your mind and improve focus.
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Breathing Guide */}
      {isBreathingGuideVisible && (
        <View style={styles.breathingContainer}>
          <Animated.View
            style={[
              styles.breathingCircle,
              { transform: [{ scale: breathingAnimation }] },
            ]}
          />
          <Animated.Text style={[styles.breathingText, { opacity: inhaleOpacity }]}>
            Inhale...
          </Animated.Text>
          <Animated.Text style={[styles.breathingText, { opacity: holdOpacity }]}>
            Hold...
          </Animated.Text>
          <Animated.Text style={[styles.breathingText, { opacity: exhaleOpacity }]}>
            Exhale...
          </Animated.Text>
        </View>
      )}

      {/* Music control buttons */}
      {isPlaying && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handlePause}>
            <Text style={styles.controlButtonText}>{isPaused ? 'Resume' : 'Pause'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={handleStop}>
            <Text style={styles.controlButtonText}>Stop</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Navigation Bar */}
                  <View style={styles.navBarContainer}>
                    <NavigationBar navigation={navigation} />
                  </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  navBarContainer: {
    position: 'absolute', // Keep navigation bar fixed at the bottom
    bottom: 0,
    left: 0,
    right: 0,
    height: 90, // Adjust the height as per your navigation bar design
    backgroundColor: '#214872',
    justifyContent: 'center',
  },
  title: {
    top:80,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf:'center',
  },
  musicList: {
    top: 90,
    width: '80%',
    alignItems: 'center',
    alignSelf:'center',
    bottom: 90,
  },
  musicButton: {
    padding: 15,
    backgroundColor: '#84A9C0',
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  musicButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#84A9C0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  breathingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Makes sure the breathing guide is centered on the screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  breathingCircle: {
    width: 200, // Set size of the circle
    height: 200, // Set size of the circle
    borderRadius: 100, // Half of the width/height to make it a circle
    backgroundColor: 'rgba(0, 122, 255, 0.5)', // Circle color (you can change it)
    justifyContent: 'center', // Centers the content inside the circle
    alignItems: 'center', // Centers the content inside the circle
    position: 'absolute', // Ensures it's positioned correctly within the container
  },
  breathingText: {
    fontSize: 20,
    color: '#FFFFFF', // Text color (you can change it)
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    padding: 10,
    alignSelf:'center',
  },
  controlButton: {
    backgroundColor: '#84A9C0',
    padding: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
