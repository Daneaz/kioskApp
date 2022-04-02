import React from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";

export default function QRCodeHolder(props) {
  return (
    <ImageBackground source={props.source} style={props.imageBtnStyle}>
      {props.text && <Text style={props.imageBtnTextStyle}>{props.text}</Text>}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
