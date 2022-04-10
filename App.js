/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from "react";
import { NativeBaseProvider, Text } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./Navigations/AuthNavigator";
import { getData } from "./Services/Utility";
import { GlobalContextProvider } from "./States/GlobalState";
import { USER } from "./Constants/Constant";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchData() {
      let user = await getData(USER);
      setUser(user);
    }

    fetchData();
  }, []);

  return (
    <NativeBaseProvider>
      <GlobalContextProvider>
        <NavigationContainer fallback={<Text>Loading...</Text>}>
          <AuthNavigator role={user} />
        </NavigationContainer>
      </GlobalContextProvider>
    </NativeBaseProvider>
  );

}
