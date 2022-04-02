import React from "react";

import { Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import ImageButton from "../Components/ImageButton";
import { VStack } from "native-base";


export default function HomeScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground source={require("../Assets/Images/bg.png")} resizeMode="stretch" style={styles.image}>
        <VStack style={styles.languageBtnPosition}>
          <ImageButton source={require("../Assets/Images/language.png")} imageBtnStyle={styles.languageBtn}
                       onPress={() => console.log("press")} />
        </VStack>
        <VStack style={styles.bannerPosition}>
          <Image source={require("../Assets/Images/banner.png")} style={styles.banner} />
        </VStack>
        <VStack space={6} style={styles.buttonsPosition}>
          <ImageButton source={require("../Assets/Images/retrieve-en.png")} imageBtnStyle={styles.buttons}
                       onPress={() => navigation.navigate("RetrieveToken")} />
          <ImageButton source={require("../Assets/Images/purchase-en.png")} imageBtnStyle={styles.buttons}
                       onPress={() => navigation.navigate("Purchase")} />
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

