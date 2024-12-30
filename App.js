import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './SignUp'; // Ensure the path is correct
import Login from './Login'; // Ensure the path is correct
import HomeScreen from './HomeScreen'; // Ensure the path is correct
import Favorites from './Favorites'; // Ensure the path is correct
import Music from './Music'; // Ensure the path is correct
import Timer from './Timer'; // Ensure the path is correct

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Favorites" component={Favorites} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="Timer" component={Timer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
