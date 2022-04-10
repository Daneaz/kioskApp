import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Box, Button, HStack, Modal, VStack } from "native-base";
import { fetchAPI } from "../Services/Utility";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";


export default function PurchaseBanner(props) {
  const [showModal, setShowModal] = useState(false);
  const [tokenLang, setTokenLang] = useState(false);

  const [state] = useContext(GlobalContext);

  useEffect(() => {
    if (state.language === CN)
      setTokenLang("币");
    else
      setTokenLang("Tokens");
  }, [state.language]);

  const promotion = props.promotion;

  async function handleCheckout() {
    setShowModal(false);
    let order = await fetchAPI("POST", `orderMgt/newOrder`, promotion);
    props.navigation.navigate("FOMOPay", { url: order });
  }

  return (
    <>
      <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={() => setShowModal(true)}>
        <ImageBackground source={require("../Assets/Images/purchase-bg-holder.png")} style={styles.banner}>
          <VStack>
            <ImageBackground source={require("../Assets/Images/promotion-title-holder.png")}
                             style={styles.promotionTitle}>
              <Image source={require("../Assets/Images/minigame-icon.png")} style={styles.miniGame} />
              <Text style={styles.promotionTitleText}>{promotion.name}</Text>
            </ImageBackground>
            <HStack space={7} my={1} mx={5}>
              <Image source={require("../Assets/Images/purchase-icon.png")} style={styles.icon} />
              <Text style={styles.text}>{`${promotion.tokens} ${tokenLang}`}</Text>
              <Box style={styles.box}>
                <Text style={styles.textMoney}>{`SGD ${promotion.sellingPrice}`}</Text>
              </Box>
            </HStack>
          </VStack>
        </ImageBackground>
      </TouchableOpacity>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth={350}>
          <Modal.CloseButton />
          <Modal.Header>New Order</Modal.Header>
          <Modal.Body>
            <VStack my={5} space={5}>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total Tokens</Text>
                <Text>{promotion.tokens}</Text>
              </HStack>
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontWeight="medium">Total Amount</Text>
                <Text color="green.500">SGD {promotion.sellingPrice}</Text>
              </HStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={"outline"}
                    onPress={() => handleCheckout()}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  banner: {
    width: 326,
    height: 76,
    borderRadius: 20,
    resizeMode: "cover",
  },
  icon: {
    width: 28,
    height: 28,
  },
  promotionTitle: {
    flexDirection: "row",
    maxWidth: 350,
    minWidth: 111,
    height: 20,
    alignSelf: "flex-end",
    resizeMode: "contain",
  },
  miniGame: {
    margin: 2,
    width: 17,
    height: 14,
  },
  promotionTitleText: {
    margin: 2,
    fontWeight: "bold",
    fontSize: 10,
    color: "white",
  },
  text: {
    paddingLeft: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  textMoney: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
    color: "orange",
    paddingTop: 3,
  },
  box: {
    position: "absolute",
    right: 5,
    borderRadius: 7,
    shadowRadius: 5,
    shadowOpacity: 10,
    width: 80,
    height: 30,
    backgroundColor: "white",
  },

});
