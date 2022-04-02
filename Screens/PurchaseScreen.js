import React, { useEffect, useState } from "react";

import PurchaseBanner from "../Components/PurchaseBanner";
import { VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { fetchAPI } from "../Services/utility";
import * as AlertMsg from "../Components/Alert";
import { ScrollView } from "react-native";

export default function PurchaseScreen({ navigation }) {
  const [timer, setTimer] = useState(120);
  const [promotionList, setPromotionList] = React.useState(null);
  const en = require("../Assets/Images/purchase-bg-en.png");
  const cn = require("../Assets/Images/purchase-bg-cn.png");

  useEffect(() => {
    getPromotionList();
  }, []);

  function getPromotionList() {
    fetchAPI("GET", `promotionMgt/getPromotionList`).then((promotion) => {
      setPromotionList(promotion);
    }).catch(error => {
      setTimeout(() => {
        AlertMsg.error(error);
      }, 1000);
    });
  }

  return (
    <BasicLayout source={en} text={timer}>
      <ScrollView style={{ maxHeight: 380 }}>
        <VStack space={5} alignItems="center" paddingTop={2}>
          {
            promotionList &&
            promotionList.map(promotion => {
              return <PurchaseBanner key={promotion._id} promotion={promotion} navigation={navigation} />;
            })
          }
        </VStack>
      </ScrollView>
    </BasicLayout>
  );
}


