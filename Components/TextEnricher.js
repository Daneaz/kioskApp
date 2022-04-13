import React from "react";
import { StyleSheet, Text } from "react-native";

export default function TextEnricher(props) {
  return (
    <Text style={{ ...props.style, ...styles.text }}>
      {props.children}
    </Text>
  );

}

const styles = StyleSheet.create({
  text: {
    textShadowOffset: { width: 10, height: 10 },
    textShadowRadius: 5,
  },
});
