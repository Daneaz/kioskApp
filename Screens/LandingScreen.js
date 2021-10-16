import React, {useEffect, useRef, useState} from 'react';
import {Button, ScrollView, Text, View} from 'react-native';
import SerialPortAPI from 'react-native-serial-port-api';

function useEventListener(eventType, handler) {
  const handerRef = useRef(handler);

  useEffect(() => {
    function internalHandler(e) {
      return handerRef.current(e);
    }

    document.addEventListener(eventType, internalHandler);

    return () => document.removeEventListener(eventType, internalHandler);
  }, [eventType]);
}

export default function LandingScreen() {
  const [output, setOutput] = useState([{text: 'test'}, {text: 'test2'}]);

  function handlerReceived(buff) {
    setOutput(...output, {
      text: `Received: ${buff.toString('hex').toUpperCase()}`,
    });
  }

  async function sendCmd(cmd) {
    try {
      const serialPort = await SerialPortAPI.open('/dev/ttyS2', {
        baudRate: 115200,
      });
      serialPort.onReceived(handlerReceived);
      await serialPort.send(cmd);

      setOutput(...output, {text: `Sent: ${cmd}`});
      serialPort.close();
    } catch (error) {
      console.log(error);
      setOutput(output + {text: `Error: ${JSON.stringify(error)}`});
    }
  }

  return (
    <View>
      <ScrollView>
        <ScrollView
          style={{height: 200, backgroundColor: '#fff'}}
          nestedScrollEnabled={true}>
          {output.map((text, i) => {
            return <Text key={i}>{JSON.stringify(text)}</Text>;
          })}
        </ScrollView>
        <Button title={'1 Token'} onPress={() => sendCmd('FE020000000103EF')} />
        <Button
          title={'10 Token'}
          onPress={() => sendCmd('FE020000010003EF')}
        />
        <Button
          title={'50 Token'}
          onPress={() => sendCmd('FE020000050007EF')}
        />
        <Button
          title={'100 Token'}
          onPress={() => sendCmd('FE020001000003EF')}
        />
        <Button
          title={'Add'}
          onPress={() => {
            setOutput(...output, {text: 'test'});
          }}
        />
        <Button
          title={'Clear'}
          onPress={() => {
            setOutput({text: ''});
          }}
        />
      </ScrollView>
    </View>
  );
}
