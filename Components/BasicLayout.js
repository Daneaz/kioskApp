import React, { useContext, useEffect } from "react";

import { ImageBackground, StatusBar, StyleSheet } from "react-native";
import ImageButton from "../Components/ImageButton";
import { Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../States/GlobalState";
import { RESET } from "../Constants/Constant";

export default function BasicLayout(props) {
  const navigation = useNavigation();
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.time <= 0) {
      dispatch({ type: RESET });
      navigation.navigate("Home");
    }
  }, [state.time]);

  return (
    <VStack>
      <StatusBar hidden={true} />
      <VStack>
        <ImageBackground source={props.source} style={styles.image}>
          <ImageButton imageBtnStyle={styles.backBtn} source={require("../Assets/Images/backBtn.png")}
                       onPress={() => {
                         if (props.clearTimer) {
                           dispatch({ type: RESET });
                         }
                         navigation.goBack();
                       }} />
        </ImageBackground>
      </VStack>
      <VStack style={styles.whiteBg}>
        <VStack style={styles.timerPosition}>
          <ImageBackground source={require("../Assets/Images/timer.png")} style={styles.timer}>
            <Text style={styles.timerText}>{`${props.text}s`}</Text>
          </ImageBackground>
        </VStack>
        {props.children}
        <VStack style={styles.homePosition}>
          <ImageButton source={require("../Assets/Images/home.png")} imageBtnStyle={styles.homeBtn}
                       onPress={() => {
                         dispatch({ type: RESET });
                         navigation.navigate("Home");
                       }} />
        </VStack>
      </VStack>
    </VStack>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 160,
  },
  whiteBg: {
    width: "100%",
    height: "100%",
  },
  timerPosition: {
    marginTop: 5,
    marginRight: 10,
    alignItems: "flex-end",
  },
  timer: {
    margin: 10,
    width: 87,
    height: 37,
    resizeMode: "stretch",
  },
  timerText: {
    textAlign: "center",
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  homePosition: {
    position: "absolute",
    right: "42%",
    bottom: "41%",
  },
  homeBtn: {
    width: 50,
    height: 50,
    resizeMode: "stretch",
  },
  backBtn: {
    margin: 15,
    width: 24,
    height: 20,
  },

});
