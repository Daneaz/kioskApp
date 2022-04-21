import React, { useContext, useEffect } from "react";

import { ImageBackground, StatusBar, StyleSheet } from "react-native";
import ImageButton from "../Components/ImageButton";
import { Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { GlobalContext } from "../States/GlobalState";
import { RESET } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";

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
    height: calculate(160),
  },
  whiteBg: {
    width: "100%",
    height: "100%",
  },
  timerPosition: {
    marginTop: calculate(5),
    marginRight: calculate(10),
    alignItems: "flex-end",
  },
  timer: {
    margin: calculate(10),
    width: calculate(87),
    height: calculate(37),
    resizeMode: "stretch",
  },
  timerText: {
    textAlign: "center",
    paddingTop: calculate(25),
    fontWeight: "bold",
    fontSize: calculate(20),
    color: "white",
  },
  homePosition: {
    position: "absolute",
    right: "42%",
    bottom: "43%",
  },
  homeBtn: {
    width: calculate(50),
    height: calculate(50),
    resizeMode: "stretch",
  },
  backBtn: {
    margin: calculate(15),
    width: calculate(24),
    height: calculate(20),
  },

});
