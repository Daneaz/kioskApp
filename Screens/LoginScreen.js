import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, FormControl, Input, Text, VStack } from "native-base";
import { Formik } from "formik";
import * as yup from "yup";
import InputLayout from "../Components/InputLayout";
import { fetchAPI, getData, removeData, storeData } from "../Services/Utility";
import Colors from "../Constants/Colors";
import { ENV } from "@env";
import MessageDialog from "../Components/MessageDialog";
import * as Constant from "../Constants/Constant";

export default function LoginScreen({ navigation }) {
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    async function getUser() {
      let user = await getData(Constant.USER);
      if (user) {
        navigation.navigate("Home");
      }
    }

    getUser();
  }, []);

  function onLogin(values, actions) {
    fetchAPI("POST", "authMgt/auth", values).then(async respObj => {
      await storeData(Constant.TOKEN, respObj.token);
      await storeData(Constant.USER, respObj.user.role.name);
      navigation.push("Home");
    }).catch(error => {
      setTimeout(async () => {
        actions.setSubmitting(false);
        await removeData(Constant.USER);
        await removeData(Constant.TOKEN);
        setMsg(error);
      }, 1000);
    });
  }

  return (
    <InputLayout>
      <Formik initialValues={{ mobile: "", password: "" }} onSubmit={onLogin}
              validationSchema={validationSchema}>
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isSubmitting }) => (
          <VStack mx={6} space={4}>
            <FormControl isRequired isInvalid={"mobile" in errors}>
              <FormControl.Label>Mobile</FormControl.Label>
              <Input
                keyboardType={"number-pad"}
                onBlur={handleBlur("mobile")}
                placeholder="Enter mobile number..."
                onChangeText={handleChange("mobile")}
                value={values.mobile}
              />
              <FormControl.ErrorMessage>
                {touched.mobile && errors.mobile}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={"password" in errors}>
              <FormControl.Label>Password</FormControl.Label>
              <Input
                type={"password"}
                onBlur={handleBlur("password")}
                placeholder="Enter password..."
                onChangeText={handleChange("password")}
                value={values.password}
                onSubmitEditing={handleSubmit}
                secureTextEntry
              />
              <FormControl.ErrorMessage>
                {touched.password && errors.password}
              </FormControl.ErrorMessage>
            </FormControl>

            <Button onPress={handleSubmit} isLoading={isSubmitting}>
              Login
            </Button>
            <View style={styles.rowContent}>
              <Text style={{ fontSize: 10 }}>
                {`${ENV} Build Version: 20220328`}</Text>
            </View>
          </VStack>
        )}
      </Formik>
      <MessageDialog type={"ERROR"} msg={msg} close={() => setMsg(null)} />
    </InputLayout>
  );
}

const styles = StyleSheet.create({
  font: {
    fontSize: 17, color: Colors.iosBlue,
  },
  rowContent: {
    flexDirection: "row", justifyContent: "center",
  },
});


const validationSchema = yup.object().shape({
  mobile: yup
    .string()
    .label("Mobile")
    .required("Please enter mobile number..."),
  password: yup
    .string()
    .label("Password")
    .required("Please enter password..."),
});
