import React, { useContext, useState } from "react";
import { ImageBackground, StyleSheet, TextInput } from "react-native";
import { HStack, Modal, VStack } from "native-base";
import ImageButton from "./ImageButton";
import Colors from "../Constants/Colors";
import MessageDialog from "./MessageDialog";
import { useNavigation } from "@react-navigation/native";
import calculate from "../Services/DimensionAdapter";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";
import TextEnrichImageButton from "./TextEnrichImageButton";

export default function InputModel(props) {
  const [token, setToken] = useState("");
  const [msg, setMsg] = useState(null);

  const navigation = useNavigation();

  const [state] = useContext(GlobalContext);

  function handleInputChange(num) {
    setToken(token.concat(num));
  }

  function handleDelete() {
    setToken(token.slice(0, -1));
  }

  function handleClear() {
    setToken("");
  }

  return (
    <Modal isOpen={props.open} onClose={props.close}>
      <ImageBackground source={require("../Assets/Images/msg-dialog-holder-input.png")}
                       style={styles.common}>
        <ImageButton source={require("../Assets/Images/msg-dialog-close-blue.png")} imageBtnStyle={styles.close}
                     onPress={props.close} />
        <VStack alignItems={"center"} paddingTop={calculate(8)}>
          <TextInput placeholder={state.language === CN ? "请输入您的取币数量" : "Please enter the amount of tokens"}
                     placeholderTextColor={Colors.inputTextColor}
                     style={styles.input} showSoftInputOnFocus={false} value={token} />
          <HStack space={calculate(5)}>
            <ImageButton source={require("../Assets/Images/number1.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("1")} />
            <ImageButton source={require("../Assets/Images/number2.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("2")} />
            <ImageButton source={require("../Assets/Images/number3.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("3")} />
          </HStack>
          <HStack space={calculate(5)}>
            <ImageButton source={require("../Assets/Images/number4.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("4")} />
            <ImageButton source={require("../Assets/Images/number5.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("5")} />
            <ImageButton source={require("../Assets/Images/number6.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("6")} />
          </HStack>
          <HStack space={calculate(5)}>
            <ImageButton source={require("../Assets/Images/number7.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("7")} />
            <ImageButton source={require("../Assets/Images/number8.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("8")} />
            <ImageButton source={require("../Assets/Images/number9.png")} imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("9")} />
          </HStack>
          <HStack space={calculate(5)}>
            <ImageButton source={require("../Assets/Images/clear.png")}
                         imageBtnStyle={styles.numbers}
                         onPress={() => handleClear()} />
            <ImageButton source={require("../Assets/Images/number0.png")}
                         imageBtnStyle={styles.numbers}
                         onPress={() => handleInputChange("0")} />
            <ImageButton source={require("../Assets/Images/delete.png")} imageBtnStyle={styles.delete}
                         onPress={() => handleDelete()} />
          </HStack>
          <TextEnrichImageButton source={require("../Assets/Images/msg-dialog-btn-input.png")}
                                 imageBtnStyle={styles.btn}
                                 text={state.language === CN ? "确认" : "Confirm"}
                                 imageBtnTextStyle={styles.infoText}
                                 onPress={() => {
                                   if (parseInt(token) > 1000) {
                                     setMsg(state.language === CN ? "最大取币数量为1000" : "Max is 1000 tokens");
                                   } else if (parseInt(token) > 0) {
                                     navigation.navigate("QRCode", { token: token, serialCom: props.serialCom });
                                     setToken("");
                                     props.close();
                                   } else {
                                     setMsg(state.language === CN ? "请输入您的取币数量" : "Please enter the amount of tokens");
                                   }
                                 }} />
        </VStack>
      </ImageBackground>
      <MessageDialog type={"ERROR"} msg={msg} close={() => setMsg(null)} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  common: {
    width: calculate(282),
    height: calculate(375),
  },
  close: {
    position: "absolute",
    top: calculate(5),
    right: calculate(5),
    width: calculate(35),
    height: calculate(37),
  },
  input: {
    width: calculate(40),
    height: calculate(40),
    marginBottom: calculate(15),
    textAlign: "center",
    minWidth: "75%",
    fontSize: calculate(13),
    backgroundColor: Colors.inputHolderColor,
    borderRadius: calculate(30),
    borderColor: Colors.inputHolderColor,
    color: Colors.inputTextColor,
  },
  infoText: {
    margin: calculate(8),
    fontSize: calculate(20),
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    textShadowColor: "#FF9900",
  },
  btn: {
    marginTop: calculate(15),
    width: calculate(160),
    height: calculate(48),
  },
  numbers: {
    width: calculate(50),
    height: calculate(50),
  },
  delete: {
    width: calculate(43),
    height: calculate(38),
    marginLeft: calculate(5),
  },
});
