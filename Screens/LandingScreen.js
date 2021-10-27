import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import SerialPortAPI from "react-native-serial-port-api";
import { Heading, VStack, Input } from "native-base";

export default function LandingScreen() {
  const [output, setOutput] = useState("");
  const [tokens, setTokens] = useState("1");
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

  function convertToHexMsg() {
    let header = "FE";
    let tail = "EF";
    let cmdType = "02";
    let cmd = header + cmdType;
    let checkSum = [];
    checkSum.push(cmdType);
    let sum = 0;
    for (let i = tokens.length; i < 4; i++) {
      cmd += "00";
    }
    for (let i = 0; i < tokens.length; i++) {
      cmd += "0" + tokens[i];
      checkSum.push("0" + tokens[i]);
    }
    for (let i = 0; i < checkSum.length; i++) {
      sum = sum ^ parseInt(checkSum[i], 16);
    }
    sum = sum.toString(16);
    if (sum.length === 1) {
      sum = "0" + sum.toString(16);
    }
    cmd += sum + tail;
    appendLog("test", sendCmd(cmd));
  }

  return (
    <View>
      <ScrollView style={{ height: "80%", backgroundColor: "#fff" }}>
        <Heading size={"xl"}>{output}</Heading>
      </ScrollView>
      <Input placeholder="Input" onChangeText={setTokens} value={tokens} />
      <Button title={"Get Tokens"} onPress={() => convertToHexMsg()} />
      <Button title={"Test"} onPress={() => appendLog("Test", "test")} />
      <Button title={"Clear"} onPress={() => setOutput("")} />
    </View>
  );
}
