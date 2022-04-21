import React, { useContext } from "react";

import { VStack } from "native-base";
import { ImageBackground, StatusBar, StyleSheet } from "react-native";
import { CN } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";
import { GlobalContext } from "../States/GlobalState";
import TextEnricher from "../Components/TextEnricher";
import TextEnrichImageButton from "../Components/TextEnrichImageButton";

export default function DisconnectScreen({ navigation }) {

  const [state, dispatch] = useContext(GlobalContext);

  return (
    <VStack alignItems="center">
      <StatusBar hidden={true} />
      <ImageBackground source={require("../Assets/Images/disconnected.png")} resizeMode="stretch"
                       style={styles.image} />

      <VStack alignItems="center" space={calculate(5)}>
        <TextEnricher style={styles.text}>{state.language === CN ? "连接中断" : "Disconnected"}</TextEnricher>

        <TextEnrichImageButton source={require("../Assets/Images/msg-dialog-btn-red.png")} imageBtnStyle={styles.btn}
                               text={state.language === CN ? "重试" : "Retry"}
                               imageBtnTextStyle={styles.btnText} onPress={() => navigation.goBack()} />
      </VStack>
    </VStack>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: calculate(367),
    height: calculate(399),
    marginBottom: calculate(15),
  },
  text: {
    fontSize: calculate(30),
    alignSelf: "center",
  },
  btn: {
    width: calculate(150),
    height: calculate(35),
  },
  btnText: {
    paddingTop: calculate(5),
    fontSize: calculate(16),
    alignSelf: "center",
    color: "white",
    textShadowColor: "#FF347B",
  },


});
