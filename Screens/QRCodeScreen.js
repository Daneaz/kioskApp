import React, { useContext, useEffect, useRef, useState } from "react";

import { HStack, Text, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { ImageBackground, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { fetchAPI } from "../Services/Utility";
import MessageDialog from "../Components/MessageDialog";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";

export default function QRCodeScreen({ route }) {
  const [qrCode, setQrCode] = useState(null);
  const [transId, setTransId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [lang, setLang] = useState();

  const statusTimer = useRef();
  const timeoutTimer = useRef();

  const [state] = useContext(GlobalContext);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  useEffect(() => {
    generateQRCode();
    return () => {
      clearInterval(statusTimer.current);
      clearInterval(timeoutTimer.current);
      PushStatusToFail();
    };
  }, []);

  async function generateQRCode() {
    try {
      let result = await fetchAPI("POST", `tokenRetrieveMgt/tokenRetrieveQRCodeGenerator`, { token: route.params.token });
      let code = {
        noOfToken: result.token,
        uniqueId: result.uniqueId,
        machineId: result.machineId,
      };
      setQrCode(JSON.stringify(code));
      setTransId(result._id);
      timeoutTimer.current = setTimeout(() => {
        checkStatus(result._id);
      }, 5000);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function checkStatus(transId) {
    try {
      let result = await fetchAPI("GET", `tokenRetrieveMgt/checkStatusAndUpdate/${transId}`);
      if (result) {
        setType("SUCCESS");
        setMsg("Token retrieved!!!");
      } else {
        statusTimer.current = setTimeout(() => {
          checkStatus(transId);
        }, 2000);
      }
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function PushStatusToFail() {
    try {
      await fetchAPI("GET", `tokenRetrieveMgt/pushToFail/${transId}`);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  return (
    <BasicLayout
      source={lang === CN ? require("../Assets/Images/purchase-bg-cn.png") : require("../Assets/Images/purchase-bg-en.png")}
      text={state.time}>
      <VStack space={5} alignItems="center" paddingTop={5}>
        <HStack justifyContent={"center"}>
          <ImageBackground source={require("../Assets/Images/qr-code-bg.png")} style={styles.image}>
            <HStack justifyContent={"center"} marginTop={20}>
              {qrCode && <QRCode value={qrCode} logo={require("../Assets/Images/icon.png")} size={162} />}
            </HStack>
          </ImageBackground>
        </HStack>
        <Text
          style={styles.timerText}>{lang === CN ? "请用 Play United App 扫码完成取币" : "Please use Play United App to scan the QR code"}</Text>
      </VStack>
      <MessageDialog type={type} msg={msg} close={() => setMsg(null)} />
    </BasicLayout>
  );
}


const styles = StyleSheet.create({
  image: {
    width: 305,
    height: 292,
    resizeMode: "contain",
  },
  timerText: {
    width: 250,
    textAlign: "center",
    fontSize: 15,
  },
});
