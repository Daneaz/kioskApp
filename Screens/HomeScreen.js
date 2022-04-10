import React, { useContext, useEffect, useRef, useState } from "react";

import { Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import ImageButton from "../Components/ImageButton";
import { VStack } from "native-base";
import { CN, EN, START, TICK } from "../Constants/Constant";
import { GlobalContext } from "../States/GlobalState";

export default function HomeScreen({ navigation }) {
  const [retrieve, setRetrieve] = useState(require("../Assets/Images/retrieve-en.png"));
  const [purchase, setPurchase] = useState(require("../Assets/Images/purchase-en.png"));
  const [state, dispatch] = useContext(GlobalContext);

  const timer = useRef();

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(timer.current);
    }
  }, [state.isRunning]);


  function onLanguagePress() {
    if (state.language === CN) {
      dispatch({ type: EN });
      setRetrieve(require("../Assets/Images/retrieve-en.png"));
      setPurchase(require("../Assets/Images/purchase-en.png"));
    } else {
      dispatch({ type: CN });
      setRetrieve(require("../Assets/Images/retrieve-cn.png"));
      setPurchase(require("../Assets/Images/purchase-cn.png"));
    }
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
          <Image source={require("../Assets/Images/banner.png")} style={styles.banner} />
        </VStack>
        <VStack space={6} style={styles.buttonsPosition}>
          <ImageButton source={retrieve} imageBtnStyle={styles.buttons}
                       onPress={() => {
                         navigation.navigate("RetrieveToken");
                         dispatch({ type: START });
                         timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
                       }} />
          <ImageButton source={purchase} imageBtnStyle={styles.buttons}
                       onPress={() => {
                         navigation.navigate("Purchase");
                         dispatch({ type: START });
                         timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
                       }} />
        </VStack>
      </ImageBackground>
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
    marginTop: 15,
    marginRight: 20,
    alignItems: "flex-end",
  },
  languageBtn: {
    margin: 5,
    width: 40,
    height: 35,
    resizeMode: "stretch",
  },
  bannerPosition: {
    alignItems: "center",
    paddingTop: 15,
  },
  banner: {
    borderWidth: 8,
    borderColor: "#F87C8D",
    borderRadius: 20,
    width: "85%",
    height: 339,
  },
  buttonsPosition: {
    alignItems: "center",
    paddingTop: 50,
  },
  buttons: {
    width: 285,
    height: 70,
    resizeMode: "stretch",
  },

});

