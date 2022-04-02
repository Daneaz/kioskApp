import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Auth Screens
import LoginScreen from "../Screens/LoginScreen";
import HomeScreen from "../Screens/HomeScreen";
import PurchaseScreen from "../Screens/PurchaseScreen";
import RetrieveTokenScreen from "../Screens/RetrieveTokenScreen";
import QRCodeScreen from "../Screens/QRCodeScreen";
import FOMOPayScreen from "../Screens/FOMOPayScreen";

export default function AuthNavigator(props) {
  switch (props.role) {
    case "Machine":
      return (<MachineStackScreen />);
    default:
      return (<AuthStackScreen />);
  }
}

const AuthStack = createStackNavigator();

export function AuthStackScreen() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="LogIn" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Purchase" component={PurchaseScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="RetrieveToken" component={RetrieveTokenScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="QRCode" component={QRCodeScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="FOMOPay" component={FOMOPayScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

const MachineStack = createStackNavigator();

function MachineStackScreen() {
  return (
    <MachineStack.Navigator>
      <MachineStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <MachineStack.Screen name="Purchase" component={PurchaseScreen} options={{ headerShown: false }} />
      <MachineStack.Screen name="RetrieveToken" component={RetrieveTokenScreen} options={{ headerShown: false }} />
      <MachineStack.Screen name="QRCode" component={QRCodeScreen} options={{ headerShown: false }} />
      <MachineStack.Screen name="FOMOPay" component={FOMOPayScreen} options={{ headerShown: false }} />
    </MachineStack.Navigator>
  );
}

