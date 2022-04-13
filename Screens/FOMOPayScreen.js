import React, { useContext, useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { VStack } from "native-base";
import { Linking, StyleSheet } from "react-native";
import { GlobalContext } from "../States/GlobalState";
import { CN, RESET } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";
import BasicLayout from "../Components/BasicLayout";

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
    <BasicLayout
      source={lang === CN ? require("../Assets/Images/purchase-bg-cn.png") : require("../Assets/Images/purchase-bg-en.png")}
      text={state.time}>
      <VStack style={styles.whiteBg}>
        <VStack style={{ height: "52%" }}>
          <WebView
            source={{
              uri: route.params.url,
            }}
          />
        </VStack>
      </VStack>
    </BasicLayout>
  );
}

const styles = StyleSheet.create({
  image: {
    flexDirection: "row",
    width: "100%",
    height: calculate(50),
  },
  whiteBg: {
    width: "100%",
    height: "100%",
  },
  timerPosition: {
    marginTop: calculate(10),
    position: "absolute",
    right: calculate(5),
  },
  timer: {
    width: calculate(70),
    height: calculate(30),
    resizeMode: "stretch",
  },
  timerText: {
    textAlign: "center",
    paddingTop: calculate(7),
    fontWeight: "bold",
    fontSize: calculate(20),
    color: "white",
  },
  homePosition: {
    position: "absolute",
    right: "42%",
    bottom: calculate(120),
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
  purchaseTitle: {
    width: calculate(180),
    height: calculate(40),
    margin: calculate(4),
    marginLeft: calculate(55),
  },
});
