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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingBottom: 20,
  },
});

export default function InputLayout(props) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}
                          enabled keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 120}>
      <ScrollView style={styles.container}>
        <SafeAreaView>
          <View style={{ ...styles.container, paddingTop: "15%" }}>
            <StatusBar hidden={true} />
            <Image
              style={{ width: 300, height: 100, resizeMode: "contain", alignSelf: "center", marginBottom: 10 }}
              source={require("../Assets/Images/font.png")}
            />
            {props.children}
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

