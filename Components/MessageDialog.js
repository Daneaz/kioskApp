import React, { useContext } from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { Image, Modal, VStack } from "native-base";
import ImageButton from "./ImageButton";
import { useNavigation } from "@react-navigation/native";
import { RESET } from "../Constants/Constant";
import { GlobalContext } from "../States/GlobalState";
import calculate from "../Services/DimensionAdapter";

export default function MessageDialog(props) {
  const navigation = useNavigation();

  const [state, dispatch] = useContext(GlobalContext);

  function MsgRouter() {
    switch (props.type) {
      case "INFO":
        return Info();
      case "WARNING":
        return Warning();
      case "ERROR":
        return Error();
      case "SUCCESS":
        return Success();
    }
  }

  function Info() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder.png")}
                            style={common.common}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={common.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-blue.png")} style={common.title}>
        <Text style={common.infoText}>Info</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-info.png")} style={common.icon} alt={"Image not found"} />
        <Text style={common.msgText}>{props.msg}</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-blue.png")} imageBtnStyle={common.btn} text={"OK"}
                     imageBtnTextStyle={common.infoText} onPress={props.close} />
      </VStack>
    </ImageBackground>;
  }

  function Warning() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder.png")}
                            style={common.common}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={common.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-yellow.png")} style={common.title}>
        <Text style={common.infoText}>Warning</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-warning.png")} style={common.icon}
               alt={"Image not found"} />
        <Text style={common.msgText}>{props.msg}</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-yellow.png")} imageBtnStyle={common.btn}
                     text={"OK"}
                     imageBtnTextStyle={common.infoText} onPress={props.close} />
      </VStack>
    </ImageBackground>;
  }

  function Error() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder.png")}
                            style={common.common}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={common.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-red.png")} style={common.title}>
        <Text style={common.infoText}>Error</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-error.png")} style={common.icon} alt={"Image not found"} />
        <Text style={common.msgText}>{props.msg}</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-red.png")} imageBtnStyle={common.btn} text={"OK"}
                     imageBtnTextStyle={common.infoText} onPress={props.close} />
      </VStack>
    </ImageBackground>;
  }

  function Success() {
    return <ImageBackground source={require("../Assets/Images/msg-dialog-holder-success.png")}
                            style={success.successHolder}>
      <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={success.close}
                   onPress={props.close} />
      <ImageBackground source={require("../Assets/Images/msg-dialog-green.png")} style={success.title}>
        <Text style={success.infoText}>Success</Text>
      </ImageBackground>
      <VStack space={1} alignItems={"center"}>
        <Image source={require("../Assets/Images/msg-dialog-success.png")} style={success.icon}
               alt={"Image not found"} />
        <Text style={success.msgText}>{props.msg}</Text>
        <ImageButton source={require("../Assets/Images/msg-dialog-btn-green.png")} imageBtnStyle={success.btn}
                     text={"OK"} imageBtnTextStyle={common.infoText}
                     onPress={() => {
                       props.close();
                       dispatch({ type: RESET });
                       navigation.navigate("Home");
                     }} />
      </VStack>
    </ImageBackground>;
  }

  return (
    <Modal isOpen={!!props.msg} onClose={props.close}>
      {MsgRouter()}
    </Modal>

  );
}

const common = StyleSheet.create({
  common: {
    width: calculate(285),
    height: calculate(285),
  },
  title: {
    alignSelf: "center",
    width: calculate(149),
    height: calculate(49),
  },
  close: {
    position: "absolute",
    top: calculate(15),
    right: calculate(10),
    width: calculate(25),
    height: calculate(25),
  },
  infoText: {
    margin: calculate(6),
    fontSize: calculate(20),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  icon: {
    width: calculate(140),
    height: calculate(140),
    alignSelf: "center",
  },
  msgText: {
    textAlign: "center",
    marginBottom: calculate(10),
    maxWidth: calculate(250),
    fontSize: calculate(15),
  },
  btn: {
    width: calculate(178),
    height: calculate(44),
  },
});

const success = StyleSheet.create({
  successHolder: {
    width: calculate(276),
    height: calculate(325),
  },
  title: {
    alignSelf: "center",
    width: calculate(149),
    height: calculate(49),
    top: calculate(70),
  },
  close: {
    position: "absolute",
    top: calculate(90),
    right: calculate(20),
    width: calculate(25),
    height: calculate(25),
  },
  infoText: {
    margin: calculate(5),
    fontSize: calculate(20),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  icon: {
    width: calculate(140),
    height: calculate(140),
    alignSelf: "center",
    top: calculate(60),
  },
  msgText: {
    textAlign: "center",
    top: calculate(40),
  },
  btn: {
    width: calculate(178),
    height: calculate(44),
    top: calculate(50),
  },
});


