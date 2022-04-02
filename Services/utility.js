import AsyncStorage from "@react-native-async-storage/async-storage";
import getEnvironment from "./environment";
import * as AlertMsg from "../Components/Alert";

export const TOKEN = "token";
export const USER = "user";


const APIURL = getEnvironment.apiUrl;
const APIVERSION = "v1/";

export const StoreData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    AlertMsg.error(err);
  }
};

export const RemoveData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    AlertMsg.error(err);
  }
};

export const GetData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    AlertMsg.error(err);
  }
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
      let token = await GetData(TOKEN);
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
          await RemoveData(TOKEN);
          await RemoveData(USER);
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
