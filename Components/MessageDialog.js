import React from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { Image, Modal, VStack } from "native-base";
import ImageButton from "./ImageButton";

export default function MessageDialog(props) {

  function MsgRouter() {
    switch (props.type) {
      case "INFO":
      case "WARNING":
      case "ERROR":
        return Info();
      case "SUCCESS":
        return Success();
    }
  }

  function Info() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder.png")}
                            style={info.common}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={info.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-blue.png")} style={info.title}>
        <Text style={info.infoText}>Info</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-error.png")} style={info.icon} />
        <Text style={info.msgText}>{props.msg}</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-blue.png")} imageBtnStyle={info.btn} text={"OK"}
                     imageBtnTextStyle={info.infoText} onPress={props.close} />
      </VStack>
    </ImageBackground>;
  }

  function Success() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder-success.png")}
                            style={success.successHolder}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={success.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-red.png")} style={success.title}>
        <Text style={success.infoText}>Success</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-success.png")} style={success.icon} />
        <Text style={success.msgText}>Success</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-red.png")} imageBtnStyle={success.btn} text={"OK"}
                     imageBtnTextStyle={info.infoText} onPress={props.close} />
      </VStack>
    </ImageBackground>;
  }

  return (
    <Modal isOpen={!!props.msg} onClose={props.close}>
      {MsgRouter()}
    </Modal>

  );
}

const info = StyleSheet.create({
  common: {
    width: 285,
    height: 285,
  },
  title: {
    alignSelf: "center",
    width: 149,
    height: 49,
  },
  close: {
    position: "absolute",
    top: 15,
    right: 10,
    width: 25,
    height: 25,
  },
  infoText: {
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  icon: {
    width: 140,
    height: 140,
    alignSelf: "center",
  },
  msgText: {
    textAlign: "center",
  },
  btn: {
    width: 178,
    height: 44,
  },
});

const success = StyleSheet.create({
  successHolder: {
    width: 276,
    height: 325,
  },
  title: {
    alignSelf: "center",
    width: 149,
    height: 49,
    top: 70,
  },
  close: {
    position: "absolute",
    top: 90,
    right: 20,
    width: 25,
    height: 25,
  },
  infoText: {
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  icon: {
    width: 140,
    height: 140,
    alignSelf: "center",
    top: 60,
  },
  msgText: {
    textAlign: "center",
    top: 40,
  },
  btn: {
    width: 178,
    height: 44,
    top: 50,
  },
});


