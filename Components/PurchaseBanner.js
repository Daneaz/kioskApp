import React, { useContext, useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Box, Button, HStack, Modal, VStack } from "native-base";
import { fetchAPI } from "../Services/Utility";
import { GlobalContext } from "../States/GlobalState";
import { CN } from "../Constants/Constant";
import calculate from "../Services/DimensionAdapter";


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
              <Image source={require("../Assets/Images/minigame-icon.png")} style={styles.miniGame}
                     alt={"Image not found"} />
              <Text style={styles.promotionTitleText}>{promotion.name}</Text>
            </ImageBackground>
            <HStack space={10} my={5} mx={10}>
              <Image source={require("../Assets/Images/purchase-icon.png")} style={styles.icon}
                     alt={"Image not found"} />
              <Text style={styles.text}>{`${promotion.tokens} ${tokenLang}`}</Text>
              <Box style={styles.box}>
                <Text style={styles.textMoney}>{`SGD ${promotion.sellingPrice}`}</Text>
              </Box>
            </HStack>
          </VStack>
        </ImageBackground>
      </TouchableOpacity>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth={calculate(350)}>
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
    width: calculate(326),
    height: calculate(76),
    borderRadius: calculate(20),
    resizeMode: "cover",
  },
  icon: {
    width: calculate(28),
    height: calculate(28),
  },
  promotionTitle: {
    flexDirection: "row",
    maxWidth: calculate(350),
    minWidth: calculate(111),
    height: calculate(20),
    alignSelf: "flex-end",
    resizeMode: "contain",
  },
  miniGame: {
    margin: calculate(2),
    width: calculate(17),
    height: calculate(14),
  },
  promotionTitleText: {
    margin: calculate(2),
    fontWeight: "bold",
    fontSize: calculate(10),
    color: "white",
  },
  text: {
    paddingLeft: calculate(10),
    fontWeight: "bold",
    fontSize: calculate(20),
    color: "white",
  },
  textMoney: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: calculate(17),
    color: "orange",
    paddingTop: calculate(3),
  },
  box: {
    position: "absolute",
    right: calculate(5),
    borderRadius: calculate(7),
    shadowRadius: calculate(5),
    shadowOpacity: calculate(10),
    width: calculate(80),
    height: calculate(30),
    backgroundColor: "white",
  },

});
