import React, { useContext, useEffect, useRef, useState } from "react";

import { HStack, Text, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { ImageBackground, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { fetchAPI } from "../Services/Utility";
import MessageDialog from "../Components/MessageDialog";
import { GlobalContext } from "../States/GlobalState";
import { CN, CREATED, SUCCESS } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";
import { dispenseToken } from "../Services/SerialService";

export default function QRCodeScreen({ route }) {
  const [status, setStatus] = useState(CREATED);
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
      if (transId && status === CREATED)
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
      let startTime = new Date();
      statusTimer.current = setInterval(() => {
        checkStatus(result._id, startTime);
      }, 5000);
    } catch (err) {
      setType("ERROR");
      setMsg(err);
    }
  }

  async function checkStatus(transId, startTime) {

    try {
      let expiredTime = startTime.getTime() + 5 * 60000;
      if(expiredTime < new Date().getTime()){
        clearInterval(statusTimer.current);
        await pushStatusToFail(transId);
      }

      let token = await fetchAPI("GET", `tokenRetrieveMgt/checkStatusAndUpdate/${transId}`);
      if (token) {
        setStatus(SUCCESS);
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
      let result = await dispenseToken(route.params.serialCom, token, setMsg, setType, lang);
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
      source={lang === CN ? require("../Assets/Images/retrieve-bg-cn.png") : require("../Assets/Images/retrieve-bg-en.png")}
      text={state.time}>
      <VStack space={20} alignItems="center" paddingTop={5}>
        <HStack justifyContent={"center"}>
          <ImageBackground source={require("../Assets/Images/qr-code-bg.png")} style={styles.image}>
            <HStack justifyContent={"center"} style={styles.qrCode}>
              {qrCode && <QRCode value={qrCode} logo={require("../Assets/Images/icon.png")} size={calculate(142)} />}
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
    width: calculate(266),
    height: calculate(255),
  },
  text: {
    textAlign: "center",
    maxWidth: calculate(200),
  },
  qrCode: {
    justifyContent: "center",
    position: "absolute",
    marginLeft: calculate(65),
    marginTop: calculate(72)
  },
});
