import React from "react";

import { ImageBackground, StatusBar, StyleSheet } from "react-native";
import ImageButton from "../Components/ImageButton";
import { VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

export default function BasicLayout(props) {
  const navigation = useNavigation();

  return (
    <VStack>
      <StatusBar hidden={true} />
      <VStack>
        <ImageBackground source={props.source} style={styles.image}>
          <ImageButton imageBtnStyle={styles.backBtn} source={require("../Assets/Images/back-btn-en.png")}
                       onPress={() => navigation.goBack()} />
        </ImageBackground>
      </VStack>
      <VStack style={styles.whiteBg}>
        <VStack style={styles.timerPosition}>
          <ImageButton source={require("../Assets/Images/timer.png")} imageBtnStyle={styles.timer}
                       imageBtnTextStyle={styles.timerText} text={`${props.text}s`} />
        </VStack>
        {props.children}
        <VStack style={styles.homePosition}>
          <ImageButton source={require("../Assets/Images/home.png")} imageBtnStyle={styles.homeBtn}
                       onPress={() => navigation.navigate("Home")} />
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
    width: 95,
    height: 50,
    resizeMode: "stretch",
  },
  timerText: {
    textAlign: "center",
    paddingTop: 14,
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
    width: 86,
    height: 28,
  },

});
