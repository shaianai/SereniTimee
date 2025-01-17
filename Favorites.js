import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import NavigationBar from './NavigationBar';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  // Fetch sessions from the Firestore database
  const fetchFavorites = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert('Error', 'You must be logged in to view favorites.');
      return;
    }
  
    try {
      const q = query(
        collection(db, 'favorites'),
        where('uid', '==', user.uid) // Fetch documents where uid matches the user's UID
      );
      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(sessions);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      Alert.alert('Error', 'Failed to load favorites.');
    }
  };
  

  // Navigate to the Start.js screen with the session details
  const handlePlay = async (session) => {
    // Navigate to the Start.js screen with session details
    navigation.navigate('Start', {
      sessionName: session.name,
      totalSeconds: convertDurationToSeconds(session.duration),
      musicFile: session.music, // Pass the music file
    });
  };
  

  // Convert duration string (e.g., "2h 30m 15s") to total seconds
  const convertDurationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration
      .split(/h|m|s/)
      .filter((x) => x) // Remove empty strings
      .map((x) => parseInt(x.trim()));
    return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <LinearGradient
      colors={['#dbecff', '#a3c5ea', '#6086b0', '#214872']}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Favorite Sessions</Text>
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.sessionCard}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionName}>{item.name}</Text>
                  <Text style={styles.sessionDuration}>{item.duration}</Text>
                </View>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => handlePlay(item)}
                >
                  <MaterialIcons name="play-arrow" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No favorites saved yet.</Text>
        )}
      </View>
      {/* Navigation Bar */}
      <View style={styles.navBarContainer}>
        <NavigationBar navigation={navigation} />
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
    paddingBottom: 80, // Add padding to prevent overlap with navigation bar
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
    color: '#fff',
    backgroundColor: '#214872',
    padding: 15,
    borderRadius: 20,
  },
  listContent: {
    paddingBottom: 100, // Extra padding for list content to avoid overlap
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#214872',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#555',
  },
  playButton: {
    backgroundColor: '#6086b0',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
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
});

