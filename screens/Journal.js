import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../components/firebase'; // Firestore instance
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Firebase authentication
import NavigationBar from '../components/NavigationBar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export default function Journal({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const auth = getAuth();
  const [fontsLoaded] = useFonts({
      'BricolageGrotesque': require('../assets/fonts/BricolageGrotesque.ttf'),
    });
  
    useEffect(() => {
      async function prepare() {
        if (!fontsLoaded) {
          await SplashScreen.preventAutoHideAsync(); // Keep the splash screen visible
        } else {
          await SplashScreen.hideAsync(); // Hide the splash screen once fonts are loaded
        }
      }
      prepare();
    }, [fontsLoaded]);
  
    // Render null or a fallback UI while the splash screen is visible
    if (!fontsLoaded) {
      return null;
    }

  // Fetch journal entries from Firestore
  const fetchJournals = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'You must be logged in to view your journals.');
      return;
    }

    try {
      const q = query(collection(db, 'journals'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      const journals = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include the document ID
        ...doc.data(), // Include all other data fields
      }));

      setNotes(journals);
    } catch (error) {
      console.error('Error fetching journals:', error);
      Alert.alert('Error', 'Failed to fetch journals. Please try again.');
    }
  };

  // Add a new journal entry to Firestore
  const addDiaryEntry = async () => {
    if (title.trim() && content.trim()) {
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add a journal entry.');
        return;
      }
  
      const newEntry = {
        title,
        content,
        date: new Date().toLocaleDateString(),
        uid: user.uid,
        createdAt: new Date(),
      };
  
      try {
        // Add to Firestore
        const docRef = await addDoc(collection(db, 'journals'), newEntry);
  
        // Add the new entry to state with the Firestore-generated ID
        setNotes((prevNotes) => [
          ...prevNotes,
          { id: docRef.id, ...newEntry },
        ]);
  
        setTitle('');
        setContent('');
        setModalVisible(false);
      } catch (error) {
        console.error('Error saving journal entry:', error);
        Alert.alert('Error', 'Failed to save journal entry. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Both title and content are required!');
    }
  };
  

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <LinearGradient
      colors={['#0F4470', '#84A9C0']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Journal</Text>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id} // Ensure every item has a unique 'id'
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
            <Text style={styles.cardContent} numberOfLines={3}>
              {item.content}
            </Text>
          </View>
        )}contentContainerStyle={{
          paddingBottom: 90, // Prevent overlap with navigation bar
        }}
      />


      {/* Add Entry Button */}
      <TouchableOpacity
        style={[styles.addButton, { bottom: 140}]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={36} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Entry Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>New Journal Entry</Text>

                {/* Title Input */}
                <TextInput
                  style={styles.modalInput}
                  placeholder="Title"
                  placeholderTextColor="#A0B0C0"
                  value={title}
                  onChangeText={setTitle}
                />

                {/* Content Input */}
                <TextInput
                  style={styles.modalTextarea}
                  placeholder="Write about your day..."
                  placeholderTextColor="#A0B0C0"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={addDiaryEntry}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#0F4470',
    alignItems: 'center',
    elevation: 5,
  },
  headerText: {
    fontFamily: 'BricolageGrotesque',
    fontSize: 28,
    //fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#84A9C0',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'BricolageGrotesque',
    color: '#0F4470',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#84A9C0',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#0F4470',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#84A9C0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F4470',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#F4F7FA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#0F4470',
    borderWidth: 1,
    borderColor: '#84A9C0',
  },
  modalTextarea: {
    backgroundColor: '#F4F7FA',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#0F4470',
    borderWidth: 1,
    borderColor: '#84A9C0',
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#84A9C0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
