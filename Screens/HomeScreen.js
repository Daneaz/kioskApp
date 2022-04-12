import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import ImageButton from "../Components/ImageButton";
import { VStack } from "native-base";
import { CN, EN, START, TICK } from "../Constants/Constant";
import { GlobalContext } from "../States/GlobalState";
import SerialPortAPI from "react-native-serial-port-api";
import MessageDialog from "../Components/MessageDialog";
import calculate from "../Services/DimensionAdapter";

export default function HomeScreen({ navigation }) {
  const [lang, setLang] = useState();
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [state, dispatch] = useContext(GlobalContext);

  const timer = useRef();
  const serialCom = useRef();

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(timer.current);
    }
  }, [state.isRunning]);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  function onLanguagePress() {
    if (state.language === CN) {
      dispatch({ type: EN });
    } else {
      dispatch({ type: CN });
    }
  }

  useEffect(() => {
    init();
  }, []);


  async function init() {
    try {
      serialCom.current = await SerialPortAPI.open("/dev/ttyS2", {
        baudRate: 115200,
      });
      serialCom.current.onReceived(handlerReceived);
    } catch (error) {
      setType("ERROR");
      setMsg(error.toString());
    }
  }

  function formatHexMsg(msg) {
    let out = "";
    msg = msg.split("");
    for (let i = 0; i < msg.length; i++) {

      if (i % 2 === 1) {
        out += msg[i] + " ";
      } else {
        out += msg[i];
      }
    }
    return out;
  }

  const handlerReceived = useCallback((buff) => {
    let hex = formatHexMsg(buff.toString("hex").toUpperCase());
    console.log("Received", hex);
  });


  async function executeCmd(cmd) {
    try {
      await serialCom.current.send(cmd);
      console.log(formatHexMsg(cmd));
    } catch (error) {
      console.log(`Error ${JSON.stringify(error)}`);
    }
  }

  function openAndClose(cmdType, dataSize, data) {
    let header = "55AA";
    let checkSum = [];
    let dataInHex = ("00" + parseInt(data).toString(16).toUpperCase()).slice(-2);
    let cmd = header + dataSize + cmdType + dataInHex;
    checkSum.push(dataSize);
    checkSum.push(cmdType);
    checkSum.push(dataInHex);
    cmd += calculateCheckSum(checkSum);
    console.log(formatHexMsg(cmd));
    executeCmd(cmd);
  }

  function dispenseToken(token) {
    constructHexCmd("C0", "04", token);
  }

  function openOrCloseCashier(open) {
    if (open) {
      openAndClose("C1", "03", "01");
    } else {
      openAndClose("C1", "03", "00");
    }
  }

  function constructHexCmd(cmdType, dataSize, token) {
    let header = "55AA";
    let checkSum = [];
    let tokensInHex = (
      "0000" + parseInt(token).toString(16).toUpperCase()
    ).slice(-4);
    let cmd = header + dataSize + cmdType + tokensInHex;
    checkSum.push(dataSize);
    checkSum.push(cmdType);
    checkSum.push(tokensInHex.substring(0, 2));
    checkSum.push(tokensInHex.substring(2, 4));
    cmd += calculateCheckSum(checkSum);
    console.log(formatHexMsg(cmd));
    executeCmd(cmd);
  }


  function calculateCheckSum(checkSum) {
    let sum = 0;
    for (let i = 0; i < checkSum.length; i++) {
      sum = sum ^ parseInt(checkSum[i], 16);
    }
    sum = sum.toString(16).toUpperCase();
    return sum;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={require("../Assets/Images/bg.png")} resizeMode="stretch" style={styles.image}>
        <VStack style={styles.languageBtnPosition}>
          <ImageButton source={require("../Assets/Images/language.png")} imageBtnStyle={styles.languageBtn}
                       onPress={() => onLanguagePress()} />
        </VStack>
        <VStack style={styles.bannerPosition}>
          <Image source={require("../Assets/Images/banner.png")} style={styles.banner} alt={"Image not found"} />
        </VStack>
        <VStack space={10} style={styles.buttonsPosition}>
          <ImageButton
            source={lang === CN ? require("../Assets/Images/retrieve-cn.png") : require("../Assets/Images/retrieve-en.png")}
            imageBtnStyle={styles.buttons}
            onPress={() => {
              navigation.navigate("RetrieveToken");
              dispatch({ type: START });
              timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
            }} />
          <ImageButton
            source={lang === CN ? require("../Assets/Images/purchase-cn.png") : require("../Assets/Images/purchase-en.png")}
            imageBtnStyle={styles.buttons}
            onPress={() => {
              setType("INFO");
              setMsg("Coming Soon!!!");
              // navigation.navigate("Purchase");
              // dispatch({ type: START });
              // timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
            }} />
        </VStack>
      </ImageBackground>
      <MessageDialog type={type} msg={msg} close={() => setMsg(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  languageBtnPosition: {
    marginTop: calculate(15),
    marginRight: calculate(20),
    alignItems: "flex-end",
  },
  languageBtn: {
    width: calculate(40),
    height: calculate(35),
    resizeMode: "stretch",
  },
  bannerPosition: {
    alignItems: "center",
    paddingTop: calculate(10),
  },
  banner: {
    borderWidth: calculate(8),
    borderColor: "#F87C8D",
    borderRadius: calculate(20),
    width: calculate(315),
    height: calculate(339),
  },
  buttonsPosition: {
    alignItems: "center",
    paddingTop: calculate(20),
  },
  buttons: {
    width: calculate(285),
    height: calculate(70),
    resizeMode: "stretch",
  },

});

