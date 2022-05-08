import React, { useContext, useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import ImageButton from "../Components/ImageButton";
import { VStack } from "native-base";
import * as Constant from "../Constants/Constant";
import { CN, EN, START, TICK } from "../Constants/Constant";
import { GlobalContext } from "../States/GlobalState";
import SerialPortAPI from "react-native-serial-port-api";
import MessageDialog from "../Components/MessageDialog";
import calculate from "../Services/DimensionAdapter";
import { formatHexMsg } from "../Services/SerialService";
import { useIsFocused } from "@react-navigation/native";
import { getData, removeData } from "../Services/Utility";
import Carousel from "react-native-snap-carousel";
import Video from "react-native-video";

const DATA = [
  {
    id: 0,
    mediaType: "video",
    imgUrl: require("../Assets/Images/banner-video.mov"),
  },
  {
    id: 1,
    mediaType: "video",
    imgUrl: require("../Assets/Images/retrive-token.mp4"),
  },
];

export default function HomeScreen({ navigation }) {
  const [backDoorCounter, setBackDoorCounter] = useState(0);
  const [lang, setLang] = useState();
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState(null);
  const [state, dispatch] = useContext(GlobalContext);
  const [activeIndex, setActiveIndex] = useState(0);

  const timer = useRef();
  const carousel = useRef();
  const serialCom = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && !serialCom.current) {
      init();
    }
    setBackDoorCounter(0);
  }, [isFocused]);

  useEffect(() => {
    if (!state.isRunning) {
      clearInterval(timer.current);
    }
  }, [state.isRunning]);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  async function onLanguagePress() {
    if (state.language === CN) {
      dispatch({ type: EN });
    } else {
      dispatch({ type: CN });
    }
    setBackDoorCounter(backDoorCounter + 1);
    if (backDoorCounter === 10) {
      await removeData(Constant.USER);
      await removeData(Constant.TOKEN);
      navigation.navigate("LogIn");
    }
  }

  async function init() {
    try {
      let port;
      let user = await getData(Constant.USER);
      if (user.mobile === 0) {
        port = "/dev/ttyS2";
      } else {
        port = "/dev/ttyS3";
      }
      serialCom.current = await SerialPortAPI.open(port, {
        baudRate: 115200,
      });

    } catch (error) {
      setType("ERROR");
      setMsg(error.toString());
    }
  }

  function renderItem({ item }) {
    if (item.mediaType === "image") {
      return (
        <View>
          <Image source={item.imgUrl} style={styles.banner} alt={"Image not found"} />
        </View>
      );
    } else {
      return (
        <Video
          source={item.imgUrl}
          resizeMode={"stretch"}
          style={styles.backgroundVideo}
          controls={false}
          paused={activeIndex !== item.id}
          playInBackground={false}
          onEnd={() => carousel.current.snapToNext()}
          repeat={true} />
      );
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
          <Carousel
            ref={(c) => carousel.current = c}
            layout={"default"}
            firstItem={0}
            data={DATA}
            loop={true}
            lockScrollWhileSnapping={true}
            sliderWidth={calculate(315)}
            itemWidth={calculate(315)}
            itemHeight={calculate(339)}
            renderItem={renderItem}
            scrollEnabled={false}
            onSnapToItem={index => setActiveIndex(index)} />
        </VStack>
        <VStack space={10} style={styles.buttonsPosition}>
          <ImageButton
            source={lang === CN ? require("../Assets/Images/retrieve-cn.png") : require("../Assets/Images/retrieve-en.png")}
            imageBtnStyle={styles.buttons}
            onPress={() => {
              navigation.navigate("RetrieveToken", { serialCom: serialCom });
              dispatch({ type: START });
              timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
            }} />
          <ImageButton
            source={lang === CN ? require("../Assets/Images/purchase-cn.png") : require("../Assets/Images/purchase-en.png")}
            imageBtnStyle={styles.buttons}
            onPress={() => {
              setType("INFO");
              state.language === CN ?
                setMsg("正在努力实现中。。。请用手机 App 购买") : setMsg("Coming Soon!!! Please use our Play United App to purchase now");
              // navigation.navigate("Purchase");
              // dispatch({ type: START });
              // timer.current = setInterval(() => dispatch({ type: TICK }), 1000);
            }} />
        </VStack>
      </ImageBackground>
      <MessageDialog type={type} msg={msg} close={() => setMsg(null)}
                     onConfirm={() => navigation.navigate("Disconnected")} />
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
    marginTop: calculate(15),
    marginRight: calculate(20),
    alignItems: "flex-end",
  },
  languageBtn: {
    width: calculate(40),
    height: calculate(35),
    resizeMode: "stretch",
  },
  bannerPosition: {
    alignItems: "center",
    paddingTop: calculate(10),
  },
  banner: {
    borderWidth: calculate(5),
    borderColor: "#F87C8D",
    borderRadius: calculate(20),
    width: calculate(315),
    height: calculate(339),
    resizeMode: "stretch",
  },
  buttonsPosition: {
    alignItems: "center",
    paddingTop: calculate(20),
  },
  buttons: {
    width: calculate(285),
    height: calculate(70),
    resizeMode: "stretch",
  },
  backgroundVideo: {
    borderWidth: calculate(5),
    borderColor: "#F87C8D",
    borderRadius: calculate(20),
    width: calculate(315),
    height: calculate(339),
  },
});

