import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvironment from "./Environment";
import * as Constant from "../Constants/Constant";
import { USER } from "../Constants/Constant";

const APIURL = getEnvironment.apiUrl;
const APIVERSION = "v1/";

export const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const removeData = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const getData = async (key) => {
  if (key === USER) {
    let user = await AsyncStorage.getItem(key);
    return JSON.parse(user);
  }
  return await AsyncStorage.getItem(key);
};

export const storeKey = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const getKey = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const clearAllData = async () => {
  let user = await AsyncStorage.getItem(USER);
  await AsyncStorage.clear();
  await AsyncStorage.setItem(USER, user);
};

//RESTful API fetch
const getApiUrl = (path) => {
  return `${APIURL}/api${path.startsWith("/") ? "" : "/"}${path}`;
};


const getApiConf = (method, jsonObj, token) => {
  let conf = { "method": method, headers: {} };
  conf.headers = { "Content-Type": "application/json" };

  if (token)
    conf.headers.Authorization = "Bearer " + token;

  if (jsonObj) {
    conf.body = JSON.stringify(jsonObj);
  }
  return conf;
};


export const fetchAPI = async (method, url, jsonObj) => {
  return new Promise(async function(resolve, reject) {
    try {
      //add token into header if token existed
      let token = await getData(Constant.TOKEN);
      //send request
      const resp = await fetch(getApiUrl(APIVERSION + url), getApiConf(method, jsonObj, token));

      let respJson;
      try {
        respJson = await resp.json();
      } catch (error) {
        respJson = resp;
      }

      switch (resp.status) {
        case 200:
        case 201:
        case 202:
        case 204:
          resolve(respJson);
          break;
        case 400:
          reject(respJson);
          break;
        case 401:
          await removeData(Constant.TOKEN);
          await removeData(Constant.USER);
          reject(respJson);
          break;
        case 403:
          reject(`Permission denied. ${respJson}`);
          break;
        case 404:
          reject(`Error 404. ${respJson.message}, url: ${respJson.url}`);
          break;
        case 406:
          reject(`Request content error. ${respJson}`);
          break;
        case 409:
          reject(`Conflict... ${respJson}`);
          break;
        case 500:
          reject(`Internal server error, ${respJson}`);
          break;
        default:
          reject(`Unknown status: ${resp.status}, Error: ${JSON.stringify(respJson)}}`);
          break;
      }
    } catch (error) {
      if (error.toString() === "TypeError: Network request failed")
        reject("Network error, please check your network connection and retry. If error still exist, please contact administrator for help");
      else
        reject(`Unknown Response ${error}`);
    }
  });
};
