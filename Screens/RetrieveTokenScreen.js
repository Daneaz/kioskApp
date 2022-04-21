import React, { useContext, useEffect, useState } from "react";

import { HStack, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import ImageButton from "../Components/ImageButton";
import { StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";
import InputModel from "../Components/InputModel";
import calculate from "../Services/DimensionAdapter";

export default function RetrieveTokenScreen({ navigation, route }) {
  const [lang, setLang] = useState();
  const [tokenLang, setTokenLang] = useState();
  const [open, setOpen] = useState();

  const [state] = useContext(GlobalContext);

  useEffect(() => {
    setLang(state.language);
    if (state.language === CN)
      setTokenLang("币");
    else
      setTokenLang("Tokens");
  }, [state.language]);

  return (
    <BasicLayout
      source={lang === CN ? require("../Assets/Images/retrieve-bg-cn.png") : require("../Assets/Images/retrieve-bg-en.png")}
      text={state.time} clearTimer={true}>
      <VStack space={10} paddingTop={5}>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-10.png")}
                       text={`10 ${tokenLang}`} imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.tokenText}
                       onPress={() => navigation.navigate("QRCode", {
                         token: "10",
                         serialCom: route.params.serialCom,
                       })} />
          <ImageButton source={require("../Assets/Images/token-20.png")} text={`20 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.tokenText}
                       onPress={() => navigation.navigate("QRCode", {
                         token: "20",
                         serialCom: route.params.serialCom,
                       })} />
          <ImageButton source={require("../Assets/Images/token-30.png")} text={`30 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.tokenText}
                       onPress={() => navigation.navigate("QRCode", {
                         token: "30",
                         serialCom: route.params.serialCom,
                       })} />
        </HStack>
        <HStack space={5} justifyContent={"center"}>
          <ImageButton source={require("../Assets/Images/token-50.png")} text={`50 ${tokenLang}`}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.tokenText}
                       onPress={() => navigation.navigate("QRCode", {
                         token: "50",
                         serialCom: route.params.serialCom,
                       })} />
          <ImageButton source={require("../Assets/Images/token-100.png")} text={`100 ${tokenLang}`}
                       imageBtnStyle={styles.image} imageBtnTextStyle={styles.tokenText}
                       onPress={() => navigation.navigate("QRCode", {
                         token: "100",
                         serialCom: route.params.serialCom,
                       })} />
          <ImageButton source={require("../Assets/Images/token-more.png")} text={lang === CN ? "自定义" : "Others"}
                       imageBtnStyle={styles.image}
                       imageBtnTextStyle={styles.tokenText} onPress={() => setOpen(true)} />
        </HStack>
      </VStack>
      <InputModel open={open} close={() => setOpen(false)} serialCom={route.params.serialCom} />
    </BasicLayout>
  );
}

const styles = StyleSheet.create({
  image: {
    width: calculate(110),
    height: calculate(143),
    resizeMode: "cover",
  },
  tokenText: {
    textAlign: "center",
    position: "relative",
    top: calculate(114),
    fontSize: calculate(17),
    fontWeight: "bold",
  },
});




