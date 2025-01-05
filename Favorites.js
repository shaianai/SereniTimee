import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App({ navigation }) {
  const [input, setInput] = useState('');
  const [events, setEvents] = useState([]);

  const addEvent = () => {
    if (input.trim()) {
      setEvents([...events, input]);
      setInput('');
    }
  };

  const startEvent = (eventName) => {
    alert(`Starting: ${eventName}`);
  };

  return (
    <LinearGradient
      colors={['#B2C9E3', '#F4F7FA']} // Gradient colors
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorites</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Activity ▼</Text>
        </TouchableOpacity>
      </View>

      {/* Input Field */}
      <TextInput
        style={styles.input}
        placeholder="Add a new event..."
        placeholderTextColor="#A0B0C0"
        value={input}
        onChangeText={setInput}
      />

      {/* Add Button */}
      <TouchableOpacity onPress={addEvent} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Event</Text>
      </TouchableOpacity>

      {/* Event List */}
      <FlatList
        data={events}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <Text style={styles.eventText}>{item}</Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => startEvent(item)}
            >
              <Text style={styles.startButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

          {/* Navigation Bar */}
                <NavigationBar navigation={navigation} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10, // Spacing below the header
    marginTop: 40, // Added margin to push the header down
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4C637D',
  },
  dropdown: {
    backgroundColor: '#DEE6F2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#4C637D',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 20, // Added horizontal margin for better alignment
    marginBottom: 10,
    fontSize: 16,
    color: '#4C637D',
    borderWidth: 1,
    borderColor: '#DEE6F2',
  },
  addButton: {
    backgroundColor: '#4C637D',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20, // Align with the input
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 20, // Align events with the rest of the layout
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DEE6F2',
  },
  eventText: {
    fontSize: 16,
    color: '#4C637D',
  },
  startButton: {
    backgroundColor: '#B4C9E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#4C637D',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
