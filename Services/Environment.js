import { ENV } from "@env";

export const S3UatUrl = "https://playuniteduat.s3.ap-southeast-1.amazonaws.com/";
export const S3ProdUrl = "https://playunitedprod.s3.ap-southeast-1.amazonaws.com/";
const uatUrl = "http://13.250.40.143:5000";
const prodUrl = "http://13.250.40.143:8000";
const ENVURL = {
    dev: {
        envName: "DEV",
        apiUrl: "http://192.168.1.199:5000",
        s3Url: S3UatUrl,
    },
    uat: {
        envName: "UAT",
        apiUrl: uatUrl,
        s3Url: S3UatUrl,
    },
    prod: {
        envName: "PROD",
        apiUrl: prodUrl,
        s3Url: S3ProdUrl,
    },
};


function getEnvironment() {
    if (ENV === "PROD") {
        return ENVURL.prod; // prod env settings
    } else if (ENV === "UAT") {
        return ENVURL.uat; // stage env settings
    } else {
        return ENVURL.dev; // dev env settings
    }
}

export default getEnvironment();
