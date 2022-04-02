import React from "react";
import { Alert } from "react-native";


export function info(msg) {
    return (
      alertmsg("Information", msg)
    );
}

export function success(msg) {
    return (
      alertmsg("Success", msg)
    );
}

export function warning(msg) {
    return (
      alertmsg("Warning", msg)
    );
}

export function error(msg) {
    return (
      alertmsg("Error", msg)
    );
}

function alertmsg(title, msg) {
    Alert.alert(
      title,
      msg,
      [
          { text: "OK" },
      ],
      { cancelable: false },
    );
}
