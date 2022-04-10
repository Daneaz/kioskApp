import React, { useContext, useEffect, useState } from "react";

import PurchaseBanner from "../Components/PurchaseBanner";
import { VStack } from "native-base";
import BasicLayout from "../Components/BasicLayout";
import { fetchAPI } from "../Services/Utility";
import MessageDialog from "../Components/MessageDialog";
import { ScrollView } from "react-native";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";

export default function PurchaseScreen({ navigation }) {
  const [promotionList, setPromotionList] = React.useState(null);
  const [msg, setMsg] = useState(null);
  const [lang, setLang] = useState();

  const [state] = useContext(GlobalContext);

  useEffect(() => {
    setLang(state.language);
  }, [state.language]);

  useEffect(() => {
    getPromotionList();
  }, []);

  function getPromotionList() {
    fetchAPI("GET", `promotionMgt/getPromotionList`).then((promotion) => {
      setPromotionList(promotion);
    }).catch(error => {
      setTimeout(() => {
        setMsg(error);
      }, 1000);
    });
  }

  return (
    <BasicLayout
      source={lang === CN ? require("../Assets/Images/purchase-bg-cn.png") : require("../Assets/Images/purchase-bg-en.png")}
      text={state.time} clearTimer={true}>
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
      <MessageDialog type={"INFO"} msg={msg} close={() => setMsg(null)} />
    </BasicLayout>
  );
}


