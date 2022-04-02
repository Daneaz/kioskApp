import React, { useEffect, useState } from "react";

import { HStack, Text, VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { ImageBackground, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { fetchAPI } from "../Services/utility";
import * as AlertMsg from "../Components/Alert";

export default function QRCodeScreen({ navigation, route }) {
  const [timer, setTimer] = useState(120);
  const [qrCode, setQrCode] = useState("null");
  const [transId, setTransId] = useState("null");
  const en = require("../Assets/Images/purchase-bg-en.png");
  const cn = require("../Assets/Images/purchase-bg-cn.png");

  useEffect(() => {

  }, []);

  useEffect(() => {
    GenerateQRCode();
  }, []);

  async function GenerateQRCode() {
    fetchAPI("POST", `tokenRetrieveMgt/tokenRetrieveQRCodeGenerator`, { token: route.params.token }).then(result => {
      let code = {
        noOfToken: result.token,
        uniqueId: result.uniqueId,
        machineId: result.machineId,
      };
      setQrCode(JSON.stringify(code));
      setTransId(result._id);
      let timeout = setTimeout(() => {
        CheckStatus(result._id);
      }, 4000);
      return () => {
        clearInterval(timeout);
      };
    }).catch(error => {
      AlertMsg.error(error);
    });
  }

  function CheckStatus(transId) {
    fetchAPI("GET", `tokenRetrieveMgt/checkStatusAndUpdate/${transId}`).then(result => {
      if (result) {
        AlertMsg.info("Success");
      } else {
        setTimeout(() => {
          CheckStatus(transId);
        }, 2000);
      }
    }).catch(error => {
      AlertMsg.error(error);
    });
  }

  async function PushStatusToFail() {
    try {
      await fetchAPI("GET", `tokenRetrieveMgt/pushToFail/${transId}`);
    } catch (error) {
      AlertMsg.error(error);
    }
  }

  return (
    <BasicLayout source={en} text={timer}>
      <VStack space={5} alignItems="center" paddingTop={5}>
        <HStack justifyContent={"center"}>
          <ImageBackground source={require("../Assets/Images/qr-code-bg.png")} style={styles.image}>
            <HStack justifyContent={"center"} marginTop={20}>
              <QRCode value={qrCode} logo={require("../Assets/Images/icon.png")} size={162} />
            </HStack>
          </ImageBackground>
        </HStack>
        <Text style={styles.timerText}>Please use Play United App to scan the QR code</Text>
      </VStack>
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
