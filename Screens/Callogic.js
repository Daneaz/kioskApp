import React, { useCallback, useEffect, useState } from "react";
import { Button, ScrollView, View } from "react-native";
import SerialPortAPI from "react-native-serial-port-api";
import { Heading, Input } from "native-base";

export default function LandingScreen() {
  const [output, setOutput] = useState("");
  const [tokens, setTokens] = useState();
  const [serialPort, setSerialPort] = useState(null);

  useEffect(() => {
    async function init() {
      const serialCom = await SerialPortAPI.open("/dev/ttyS2", {
        baudRate: 115200,
      });
      serialCom.onReceived(handlerReceived);
      setSerialPort(serialCom);
    }

    init();
    return () => close();
  }, []);

  function close() {
    if (serialPort)
      serialPort.close();
  }

  function appendLog(prefix, msg) {
    setOutput(`${output} ${prefix}: ${msg} \n`);
  }

  function printHexMsg(msg) {
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
    let hex = printHexMsg(buff.toString("hex").toUpperCase());
    appendLog("Received", hex);
  });

  async function sendCmd(cmd) {
    try {
      await serialPort.send(cmd);
      appendLog("Sent", printHexMsg(cmd));
    } catch (error) {
      appendLog("Error", JSON.stringify(error));
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
    appendLog("纸钞机", printHexMsg(cmd));
    sendCmd(cmd);
  }

  function getTokenCmd(cmdType, dataSize) {
    let header = "55AA";
    let checkSum = [];
    let tokensInHex = (
      "0000" + parseInt(tokens ? tokens : 0).toString(16).toUpperCase()
    ).slice(-4);
    let cmd = header + dataSize + cmdType + tokensInHex;
    checkSum.push(dataSize);
    checkSum.push(cmdType);
    checkSum.push(tokensInHex.substring(0, 2));
    checkSum.push(tokensInHex.substring(2, 4));
    cmd += calculateCheckSum(checkSum);
    appendLog("取币", printHexMsg(cmd));
    sendCmd(cmd);
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
    <View>
      <ScrollView style={{ height: "100%", backgroundColor: "#fff" }}>
        <Heading size={"xl"}>{output}</Heading>
        <Input placeholder="在此输入出币数" onChangeText={setTokens} value={tokens} />
        <Button title={"取币"} onPress={() => getTokenCmd("C0", "04")} />
        <Button title={"开启纸钞"} onPress={() => openAndClose("C1", "03", "01")} />
        <Button title={"关闭纸钞"} onPress={() => openAndClose("C1", "03", "00")} />
        <Button title={"Test"} onPress={() => appendLog("Test", "test")} />
        <Button title={"Clear"} onPress={() => setOutput("")} />
      </ScrollView>

    </View>
  );
}
