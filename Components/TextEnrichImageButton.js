import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import TextEnricher from "./TextEnricher";

export default function TextEnrichImageButton(props) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={props.onPress}>
      <ImageBackground source={props.source} style={props.imageBtnStyle}>
        {props.text && <TextEnricher style={props.imageBtnTextStyle}>{props.text}</TextEnricher>}
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
