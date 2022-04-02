import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function MessageDialog(props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={props.onPress}>
      <ImageBackground source={props.source} style={props.imageBtnStyle}>
        {props.text && <Text style={props.imageBtnTextStyle}>{props.text}</Text>}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
