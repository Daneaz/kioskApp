function openAndClose(cmdType, dataSize, data) {
  let header = "55AA";
  let checkSum = [];
  let dataInHex = ("00" + parseInt(data).toString(16).toUpperCase()).slice(-2);
  let cmd = header + dataSize + cmdType + dataInHex;
  checkSum.push(dataSize);
  checkSum.push(cmdType);
  checkSum.push(dataInHex);
  cmd += calculateCheckSum(checkSum);
  console.log(formatHexMsg(cmd));
  return cmd;
}

export async function dispenseToken(serialCom, token, setMsg, setType) {
  setMsg("Sending command to token machine");
  let cmd = constructHexCmd("C0", "04", token);
  return await executeCmd(serialCom, cmd, setMsg, setType);
}

export async function openOrCloseCashier(serialCom, open) {
  let cmd;
  if (open) {
    cmd = openAndClose("C1", "03", "01");
  } else {
    cmd = openAndClose("C1", "03", "00");
  }
  await executeCmd(serialCom, cmd);
}

function constructHexCmd(cmdType, dataSize, token) {
  let header = "55AA";
  let checkSum = [];
  let tokensInHex = (
    "0000" + parseInt(token).toString(16).toUpperCase()
  ).slice(-4);
  let cmd = header + dataSize + cmdType + tokensInHex;
  checkSum.push(dataSize);
  checkSum.push(cmdType);
  checkSum.push(tokensInHex.substring(0, 2));
  checkSum.push(tokensInHex.substring(2, 4));
  cmd += calculateCheckSum(checkSum);
  console.log(formatHexMsg(cmd));
  return cmd;
}


function calculateCheckSum(checkSum) {
  let sum = 0;
  for (let i = 0; i < checkSum.length; i++) {
    sum = sum ^ parseInt(checkSum[i], 16);
  }
  sum = sum.toString(16).toUpperCase();
  return sum;
}

async function executeCmd(serialCom, cmd, setMsg, setType) {
  try {
    await serialCom.current.send(cmd);
    setType("SUCCESS");
    setMsg("Dispensing token...");
    return true;
  } catch (error) {
    setType("ERROR");
    setMsg(JSON.stringify(error));
    return false;
  }
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
