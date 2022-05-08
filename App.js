/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import { NativeBaseProvider, Text } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { GlobalContextProvider } from "./States/GlobalState";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./Screens/LoginScreen";
import HomeScreen from "./Screens/HomeScreen";
import PurchaseScreen from "./Screens/PurchaseScreen";
import RetrieveTokenScreen from "./Screens/RetrieveTokenScreen";
import QRCodeScreen from "./Screens/QRCodeScreen";
import FOMOPayScreen from "./Screens/FOMOPayScreen";
import DisconnectScreen from "./Screens/DisconnectScreen";
import codePush from "react-native-code-push";

let codePushOptions = { checkFrequency: codePush.CheckFrequency.MANUAL };
function App() {
  const AuthStack = createStackNavigator();

  function AuthStackScreen() {
    return (
      <AuthStack.Navigator>
        <AuthStack.Screen name="LogIn" component={LoginScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Purchase" component={PurchaseScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="RetrieveToken" component={RetrieveTokenScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="QRCode" component={QRCodeScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="FOMOPay" component={FOMOPayScreen} options={{ headerShown: false }} />
        <AuthStack.Screen name="Disconnected" component={DisconnectScreen} options={{ headerShown: false }} />
      </AuthStack.Navigator>
    );
  }

  return (
    <NativeBaseProvider>
      <GlobalContextProvider>
        <NavigationContainer fallback={<Text>Loading...</Text>}>
          <AuthStackScreen />
        </NavigationContainer>
      </GlobalContextProvider>
    </NativeBaseProvider>
  );

}

export default App = codePush(codePushOptions)(App);
