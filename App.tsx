import React from "react";
import { SafeAreaView, StatusBar, Text, View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './src/screens/Home';
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import DeviceDetails from './src/screens/DeviceDetails';

const Stack = createNativeStackNavigator();


function App(): React.JSX.Element {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="DeviceDetails" component={DeviceDetails}    options={{
            presentation: 'modal',
            animation: 'slide_from_left',
            headerShown: false,
          }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  )

}

export default App;