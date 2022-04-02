import React, { useState } from "react";

import { HStack, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import ImageButton from "../Components/ImageButton";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";


export default function RetrieveTokenScreen({ navigation }) {
  const [timer, setTimer] = useState(120);
  const [show, setShow] = useState(120);

  const en = require("../Assets/Images/retrieve-bg-en.png");
  const cn = require("../Assets/Images/retrieve-bg-cn.png");


  function displayMoreModel() {

  }

  return (
    <BasicLayout source={en} text={timer}>
      <VStack space={10} paddingTop={5}>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-10.png")} text={"10 Tokens"} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "10" })} />
          <ImageButton source={require("../Assets/Images/token-20.png")} text={"20 Tokens"} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "20" })} />
          <ImageButton source={require("../Assets/Images/token-30.png")} text={"30 Tokens"} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "30" })} />
        </HStack>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-50.png")} text={"50 Tokens"} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "50" })} />
          <ImageButton source={require("../Assets/Images/token-100.png")} text={"100 Tokens"}
                       imageBtnStyle={styles.image} imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "100" })} />
          <ImageButton source={require("../Assets/Images/token-more.png")} text={"More"} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText} onPress={() => displayMoreModel()} />
        </HStack>
      </VStack>
    </BasicLayout>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 110,
    height: 143,
    resizeMode: "cover",
  },
  timerText: {
    textAlign: "center",
    position: "relative",
    top: 114,
    fontSize: 17,
    fontWeight: "bold",
  },
});




