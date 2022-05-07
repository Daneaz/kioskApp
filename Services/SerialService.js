import { getData } from "./Utility";
import * as Constant from "../Constants/Constant";
import { CN } from "../Constants/Constant";

export async function dispenseToken(serialCom, token, setMsg, setType, lang) {
  setMsg(lang === CN ? "正在发送命令。。。" : "Sending command to token machine");
  let user = await getData(Constant.USER);
  let cmd;
  if (user.mobile === 0) {
    cmd = constructFEHeaderMsg("02", `${token}`);
  } else {
    cmd = constructHexCmd("C0", "04", token);
  }
  return await executeCmd(serialCom, cmd, setMsg, setType, lang);
}

export async function openOrCloseCashier(serialCom, open, setMsg, setType) {
  let user = await getData(Constant.USER);
  let cmd;
  if (user.mobile === 0) {
    if (open) {
      cmd = constructFEHeaderMsg("01", "02");
    } else {
      cmd = constructFEHeaderMsg("01", "00");
    }
  } else {
    if (open) {
      cmd = constructHexCmd("C2", "03", "01");
    } else {
      cmd = constructHexCmd("C2", "03", "00");
    }
  }

  await executeCmd(serialCom, cmd, setMsg, setType);
}

function constructHexCmd(cmdType, dataSize, data) {
  let header = "55AA";
  let checkSum = [];
  let cmdInHex;
  if (cmdType === "C0") {
    cmdInHex = ("0000" + parseInt(data).toString(16).toUpperCase()).slice(-4);
  } else if (cmdType === "C2") {
    cmdInHex = ("00" + parseInt(data).toString(16).toUpperCase()).slice(-2);
  }

  let cmd = header + dataSize + cmdType + cmdInHex;
  checkSum.push(dataSize);
  checkSum.push(cmdType);
  checkSum.push(cmdInHex.substring(0, 2));
  checkSum.push(cmdInHex.substring(2, 4));
  cmd += calculateCheckSum(checkSum);
  console.log(`cmd: ${formatHexMsg(cmd)}`);
  return cmd;
}


function calculateCheckSum(checkSum) {
  let sum = 0;
  for (let i = 0; i < checkSum.length; i++) {
    sum = sum ^ parseInt(checkSum[i], 16);
  }
  sum =  ("00" + sum.toString(16).toUpperCase()).slice(-2);
  return sum;
}

async function executeCmd(serialCom, cmd, setMsg, setType, lang) {
  try {
    await serialCom.current.send(cmd);
    setType("SUCCESS");
    setMsg(lang === CN ? `${convertToDecimal(cmd)}个币，出币中。。。` : `Dispensing ${convertToDecimal(cmd)} token...`);
    serialCom.current.onReceived(buff => handlerReceived(buff, setMsg, lang));
    return true;
  } catch (error) {
    setType("ERROR");
    setMsg(JSON.stringify(error));
    return false;
  }
}

function handlerReceived(buff, setMsg, lang) {
  let hex = buff.toString("hex").toUpperCase();
  console.log("Received", formatHexMsg(hex));
  if (hex === "55AA04C00000C4") {
    setMsg(lang === CN ? "出币完毕" : `All tokens has been dispensed`);
  } else {
    setMsg(lang === CN ? `库存不足，请联系工作人员补币。 已出${convertToDecimal(hex)}个币` : `Not enough token, please contact our staff to add more tokens. Dispensed ${convertToDecimal(hex)} tokens`);
  }
}

function convertToDecimal(hex) {
  let dispensedToken = parseInt(hex.substring(8, 12), 16);
  console.log(dispensedToken);
  return dispensedToken;
}

function formatHexMsg(msg) {
  let out = "";
  msg = msg.split("");
  for (let i = 0; i < msg.length; i++) {

    if (i % 2 === 1) {
      out += msg[i] + " ";
    } else {
      out += msg[i];
    }
  }
  return out;
}

function constructFEHeaderMsg(cmdType, data) {
  let header = "FE";
  let tail = "EF";
  let cmd = header + cmdType;
  let checkSum = [];
  checkSum.push(cmdType);
  let sum = 0;
  for (let i = data.length; i < 4; i++) {
    cmd += "00";
  }
  for (let i = 0; i < data.length; i++) {
    cmd += "0" + data[i];
    checkSum.push("0" + data[i]);
  }
  for (let i = 0; i < checkSum.length; i++) {
    sum = sum ^ parseInt(checkSum[i], 16);
  }
  sum = sum.toString(16);
  if (sum.length === 1) {
    sum = "0" + sum.toString(16);
  }
  cmd += sum + tail;
  console.log(formatHexMsg(cmd));
  return cmd;
}
