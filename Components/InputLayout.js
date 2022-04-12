import React from "react";

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Colors from "../Constants/Colors";
import calculate from "../Services/DimensionAdapter";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: calculate(20),
  },
});

export default function InputLayout(props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
                          enabled keyboardVerticalOffset={Platform.OS === "ios" ? calculate(90) : calculate(120)}>
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={{ ...styles.container, paddingTop: "15%" }}>
            <StatusBar hidden={true} />
            <Image
              style={{
                width: calculate(300),
                height: calculate(100),
                resizeMode: "contain",
                alignSelf: "center",
                marginBottom: calculate(10),
              }}
              source={require("../Assets/Images/font.png")}
              alt={"Image not found"}
            />
            {props.children}
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

