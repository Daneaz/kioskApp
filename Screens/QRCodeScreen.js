import React, { useContext, useEffect, useRef, useState } from "react";

import { HStack, Text, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { ImageBackground, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { fetchAPI } from "../Services/Utility";
import MessageDialog from "../Components/MessageDialog";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";
import { dispenseToken } from "../Services/SerialService";

export default function QRCodeScreen({ route }) {
  const [qrCode, setQrCode] = useState(null);
  const [transId, setTransId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [lang, setLang] = useState();

  const statusTimer = useRef();

  const [state] = useContext(GlobalContext);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  useEffect(() => {
    generateQRCode();
    return async () => {
      clearInterval(statusTimer.current);
    };
  }, []);

  useEffect(() => {
    return async () => {
      if (transId)
        await pushStatusToFail(transId);
    };
  }, [transId]);

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
      statusTimer.current = setInterval(() => {
        checkStatus(result._id);
      }, 5000);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function checkStatus(transId) {
    try {
      let token = await fetchAPI("GET", `tokenRetrieveMgt/checkStatusAndUpdate/${transId}`);
      if (token) {
        clearInterval(statusTimer.current);
        setType("SUCCESS");
        setMsg("Payment success!!!");
        setTimeout(async () => {
          await handleDispenseToken(transId, token);
        }, 500);
      }
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }


  async function handleDispenseToken(transId, token) {
    try {
      let result = await dispenseToken(route.params.serialCom, token, setMsg, setType);
      if (result) {
        await pushStatusToSuccess(transId);
      } else {
        await proceedWithRefund(transId);
      }
    } catch (error) {
      setType("ERROR");
      setMsg(JSON.stringify(error));
    }
  }

  async function proceedWithRefund(transId) {
    try {
      await fetchAPI("GET", `tokenRetrieveMgt/refund/${transId}`);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function pushStatusToSuccess(transId) {
    try {
      await fetchAPI("GET", `tokenRetrieveMgt/pushToSuccess/${transId}`);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function pushStatusToFail(transId) {
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
      <VStack space={20} alignItems="center" paddingTop={5}>
        <HStack justifyContent={"center"}>
          <ImageBackground source={require("../Assets/Images/qr-code-bg.png")} style={styles.image}>
            <HStack justifyContent={"center"} marginTop={calculate(18)}>
              {qrCode && <QRCode value={qrCode} logo={require("../Assets/Images/icon.png")} size={570} />}
            </HStack>
          </ImageBackground>
        </HStack>
        <Text fontSize={calculate(15)}
              style={styles.text}>{lang === CN ? "请用 Play United App 扫码完成取币" : "Please use Play United App to scan the QR code"}</Text>
      </VStack>
      <MessageDialog type={type} msg={msg} close={() => setMsg(null)} />
    </BasicLayout>
  );
}


const styles = StyleSheet.create({
  image: {
    width: calculate(255),
    height: calculate(255),
  },
  text: {
    textAlign: "center",
    maxWidth: calculate(200),
  },
});
