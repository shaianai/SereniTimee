import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={{ uri: 'https://i.pinimg.com/1200x/d0/9d/51/d09d516bc713c188426125f8379690e3.jpg' }} // Replace with your background image URL
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Text style={styles.myWeekText}>My week</Text>
          <Text style={styles.dayText}>Day 1 of 7</Text>
          <View style={styles.dots}>
            {[...Array(7)].map((_, index) => (
              <FontAwesome
                key={index}
                name="circle"
                size={10}
                color={index === 0 ? '#FFC107' : '#D3D3D3'}
                style={styles.dot}
              />
            ))}
          </View>
        </View>

        {/* Greeting Section */}
        <Text style={styles.greetingText}>Good Evening, User</Text>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Meditate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Sleep</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Section */}
        <View style={styles.navContainer}>
          <FontAwesome name="home" size={24} color="#fff" />
          <FontAwesome name="bookmark" size={24} color="#fff" />
          <FontAwesome name="music" size={24} color="#fff" />
        </View>
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
  },
  topSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  myWeekText: {
    color: '#fff',
    fontSize: 16,
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
  dot: {
    marginHorizontal: 3,
  },
  greetingText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
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
  navContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
