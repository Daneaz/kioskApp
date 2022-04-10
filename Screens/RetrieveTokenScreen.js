import React, { useContext, useEffect, useState } from "react";

import { HStack, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import ImageButton from "../Components/ImageButton";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";

export default function RetrieveTokenScreen({ navigation }) {
  const [lang, setLang] = useState();
  const [tokenLang, setTokenLang] = useState();

  const [state] = useContext(GlobalContext);


  useEffect(() => {
    setLang(state.language);
    if (state.language === CN)
      setTokenLang("币");
    else
      setTokenLang("Tokens");
  }, [state.language]);

  function displayMoreModel() {

  }

  return (
    <BasicLayout
      source={lang === CN ? require("../Assets/Images/retrieve-bg-cn.png") : require("../Assets/Images/retrieve-bg-en.png")}
      text={state.time} clearTimer={true}>
      <VStack space={10} paddingTop={5}>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-10.png")}
                       text={`10 ${tokenLang}`} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "10" })} />
          <ImageButton source={require("../Assets/Images/token-20.png")} text={`20 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "20" })} />
          <ImageButton source={require("../Assets/Images/token-30.png")} text={`30 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "30" })} />
        </HStack>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-50.png")} text={`50 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "50" })} />
          <ImageButton source={require("../Assets/Images/token-100.png")} text={`100 ${tokenLang}`}
                       imageBtnStyle={styles.image} imageBtnTextStyle={styles.timerText}
                       onPress={() => navigation.navigate("QRCode", { token: "100" })} />
          <ImageButton source={require("../Assets/Images/token-more.png")} text={lang === CN ? "其他" : "Others"}
                       imageBtnStyle={styles.image}
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




