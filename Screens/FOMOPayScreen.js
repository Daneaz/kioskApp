import React, { useState } from "react";
import { WebView } from "react-native-webview";
import BasicLayout from "../Components/BasicLayout";
import { VStack } from "native-base";

export default function FOMOPayScreen({ route, navigation }) {
  const [timer, setTimer] = useState(120);
  const en = require("../Assets/Images/purchase-bg-en.png");

  return (
    <BasicLayout source={en} text={timer}>
      <VStack style={{ height: "55%" }}>
        <WebView
          style={{ height: 200 }}
          source={{
            uri: route.params.url,
          }}
        />
      </VStack>

    </BasicLayout>
  );
}
