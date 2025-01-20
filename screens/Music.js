import React, {useEffect} from 'react';
import NavigationBar from '../components/NavigationBar';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';

export default function MusicSection({ navigation }) {
  const categories = ['All', 'Nature', 'Sleep', 'Anxiety'];

  const items = [
    { title: '21 Days of Calm', image: 'https://img2.akspic.ru/crops/8/4/2/2/7/172248/172248-vystrel_s_drona_na_plyazhe-plyazh-pesok-bereg-voda-1125x2436.jpg' },
    { title: 'Breathe & Refresh', image: 'https://i.pinimg.com/736x/28/c4/0c/28c40cdd12f7eca76fbb01190101507c.jpg' },
    { title: 'Healing Piano', image: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/420067537_772427041587771_3863456389887991853_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BiPHLSmhIzgQ7kNvgHTGBEG&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=AovD9LWELqjLOIOZe8l1oI-&oh=00_AYBfgc2KCarSCzRMT-H-YIBCVZ-_AcAU1BWjCH0Q6Cv7Nw&oe=67793714' },
    { title: 'Flow & Chill', image: 'https://iphoneswallpapers.com/wp-content/uploads/2022/09/Palm-Trees-Sunset-iPhone-Wallpaper-HD.jpg' },
    { title: 'Nature Bliss', image: 'https://i.pinimg.com/736x/26/d1/e6/26d1e6715a48823497bdf16d18175355.jpg' },
    { title: 'Tranquility', image: 'https://i.pinimg.com/736x/89/0e/db/890edb86fd311c5cb7c58a4a8b9e8608.jpg' },
  ];

  const handleCardPress = (title) => {
    Alert.alert('Card Pressed', `You clicked on "${title}"!`);
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://i.pinimg.com/736x/28/c4/0c/28c40cdd12f7eca76fbb01190101507c.jpg',
      }}
      style={styles.background}
    >
      {/* Overlay to lower opacity */}
      <View style={styles.overlay} />

      {/* Categories */}
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryButton}>
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Music Cards */}
      <FlatList
        data={items}
        numColumns={2}
        contentContainerStyle={styles.musicGrid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.musicCard}
            onPress={() => handleCardPress(item.title)}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
      {/* Music Bar */}
      <View style={styles.musicBar}>
        <Text style={styles.musicBarText}>Music Bar Placeholder</Text>
      </View>
      
      {/* Navigation Bar */}
      <View style={styles.navBarContainer}>
        <NavigationBar navigation={navigation} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Lower opacity
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30, // Add more space at the top
    marginBottom: 20, // Add space between categories and cards
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  musicGrid: {
    paddingHorizontal: 10,
    paddingBottom: 120, // Ensure space for the MusicBar
    marginTop: 10, // Add space between the categories and the first row of cards
  },
  musicCard: {
    flex: 1,
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardText: {
    padding: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  musicBar: {
    position: 'absolute',
    bottom: 60, // Push above the NavigationBar
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 15,
    alignItems: 'center',
    zIndex: 2, // Higher than NavigationBar
  },
  musicBarText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Lower than MusicBar
  },
});

