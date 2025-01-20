import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './screens/SignUp'; // Ensure the path is correct
import Login from './screens/Login'; // Ensure the path is correct
import HomeScreen from './screens/HomeScreen'; // Ensure the path is correct
import Favorites from './screens/Favorites'; // Ensure the path is correct
import Music from './screens/Music'; // Ensure the path is correct
import Timer from './screens/Timer'; // Ensure the path is correct
import Journal from './screens/Journal'; // Ensure the path is correct
import Meditate from './screens/Meditate'; // Ensure the path is correct
import MoodPicker from './screens/MoodPicker'; // Import the MoodPicker component
import Start from './screens/Start';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MoodPicker" component={MoodPicker} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="Timer" component={Timer} />
        <Stack.Screen name="Journal" component={Journal} />
        <Stack.Screen name="Meditate" component={Meditate} />
        <Stack.Screen name="Start" component={Start} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
