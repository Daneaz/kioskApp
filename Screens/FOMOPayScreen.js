import React, { useContext, useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { HStack, Image, Text, VStack } from "native-base";
import { ImageBackground, Linking, StatusBar, StyleSheet } from "react-native";
import MessageDialog from "../Components/MessageDialog";
import { GlobalContext } from "../States/GlobalState";
import { CN, RESET } from "../Constants/Constant";
import ImageButton from "../Components/ImageButton";

export default function FOMOPayScreen({ route, navigation }) {
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [lang, setLang] = useState();

  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.time <= 0) {
      dispatch({ type: RESET });
      navigation.navigate("Home");
    }
  }, [state.time]);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  useEffect(() => {
    let event = Linking.addEventListener("url", callback);
    return () => {
      event.remove();
    };
  }, []);

  function callback(data) {
    let { path, queryParams } = Linking.parse(data.url);
    if (path.includes("PaymentSuccess")) {
      setType("SUCCESS");
      setMsg("Payment success!!!");
    } else if (path.includes("PaymentCancel")) {
      setType("ERROR");
      setMsg("Payment fail!!!");
    }
  }

  return (
    <VStack>
      <StatusBar hidden={true} />
      <HStack>
        <ImageBackground
          source={require("../Assets/Images/fomopay-purchase.png")}
          style={styles.image}>
          <ImageButton imageBtnStyle={styles.backBtn} source={require("../Assets/Images/backBtn.png")}
                       onPress={() => navigation.goBack()} />
          <Image
            source={lang === CN ? require("../Assets/Images/fomopay-purchase-title.png") : require("../Assets/Images/fomopay-purchase-title.png")}
            style={styles.purchaseTitle} />

          <VStack style={styles.timerPosition}>
            <ImageBackground source={require("../Assets/Images/timer.png")} style={styles.timer}>
              <Text style={styles.timerText}>{`${state.time}s`}</Text>
            </ImageBackground>
          </VStack>
        </ImageBackground>
      </HStack>
      <VStack style={styles.whiteBg}>
        <VStack style={{ height: "75%" }}>
          <WebView
            source={{
              uri: route.params.url,
            }}
          />
        </VStack>
        <VStack style={styles.homePosition}>
          <ImageButton source={require("../Assets/Images/home.png")} imageBtnStyle={styles.homeBtn}
                       onPress={() => {
                         dispatch({ type: RESET });
                         navigation.navigate("Home");
                       }} />
        </VStack>
      </VStack>
      <MessageDialog type={type} msg={msg} close={() => setMsg(null)} />
    </VStack>
  );
}

const styles = StyleSheet.create({
  image: {
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  whiteBg: {
    width: "100%",
    height: "100%",
  },
  timerPosition: {
    marginTop: 10,
    position: "absolute",
    right: 5,
  },
  timer: {
    width: 70,
    height: 30,
    resizeMode: "stretch",
  },
  timerText: {
    textAlign: "center",
    paddingTop: 7,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  homePosition: {
    position: "absolute",
    right: "42%",
    bottom: 120,
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
  purchaseTitle: {
    width: 180,
    height: 40,
    margin: 4,
    marginLeft: 55,
  },
});
