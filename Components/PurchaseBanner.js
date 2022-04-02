import React, { useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Box, Button, HStack, Modal, VStack } from "native-base";
import { fetchAPI } from "../Services/utility";


export default function PurchaseBanner(props) {
  const [showModal, setShowModal] = useState(false);
  let promotion = props.promotion;

  async function handleCheckout() {
    setShowModal(false);
    let order = await fetchAPI("POST", `orderMgt/newOrder`, promotion);
    props.navigation.navigate("FOMOPay", { url: order });
  }

  return (
    <>
      <TouchableOpacity style={styles.container} activeOpacity={0.5} onPress={() => setShowModal(true)}>
        <ImageBackground source={require("../Assets/Images/purchase-bg-holder.png")} style={styles.banner}>
          <VStack mx={5} my={1}>
            <Text style={styles.promotionTitle}>{promotion.name}</Text>
            <HStack space={7} my={1}>
              <Image source={require("../Assets/Images/purchase-icon.png")} style={styles.icon} />
              <Text style={styles.text}>{`${promotion.tokens} Tokens`}</Text>
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
    fontWeight: "bold",
    fontSize: 15,
    color: "white",
  },
  text: {
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
    borderRadius: 7,
    shadowRadius: 5,
    shadowOpacity: 10,
    width: 80,
    height: 30,
    backgroundColor: "white",
  },
});
