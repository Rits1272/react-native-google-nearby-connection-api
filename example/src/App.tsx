import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, NativeModules, Button, PermissionsAndroid, TextInput, DeviceEventEmitter, CheckBox } from 'react-native';

const { NearbyChat } = NativeModules;

export default function App() {

  useEffect(() => {
    requestAccessFineLocationPermission();
    requestAccessCoarseLocationPermission();
  });

  const [deviceName, setDeviceName] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const [selectedDevices, selectDevice] = useState([]);

  const getEndpoints = (event) => {
    setEndpoints(event);
    console.log(endpoints);
  };

  const requestAccessFineLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Asking for access to Fine Location",
          message:
            "Asking for access to Fine Location",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Fine Location");
      } else {
        console.log("Fine Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestAccessCoarseLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Asking for access to Coarse Location",
          message:
            "Asking for access to Coarse Location",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Coarse Location");
      } else {
        console.log("Coarse Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const OnPressAdvertise = () => {
    NearbyChat.startAdvertising(deviceName);
    console.log("Advertise");
    console.log(endpoints);
  };

  const OnPressDiscover = () => {
    NearbyChat.startDiscovery(deviceName);
    console.log("Discover");
    console.log(endpoints);
  };

  const receiveMessage = async () => {
    const msg = await NearbyChat.getMessage();
    console.log("This is the msg", msg);
  }

  const sendMessageToSelectedDevices = () => {
    if(selectedDevices.length>0){
        selectedDevices.map((device) => {
          NearbyChat.sendMessage(device.split("_")[0], "HI there from Me!");
          console.log("Message sent!");
        })
    }
    else {
        console.log("No device selected");
    }
  }

  DeviceEventEmitter.addListener("endpoints", getEndpoints);
  DeviceEventEmitter.addListener("message", receiveMessage);

  return (
    <View style={styles.container}>
      <TextInput
        editable
        maxLength={40}
        onChangeText={text => setDeviceName(text)}
        value={deviceName}
        placeholder="Device Name"
      />
      <Button
        onPress={OnPressAdvertise}
        title="Advertise"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={OnPressDiscover}
        title="Discover"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <View>
        <Text>Available Devices</Text>
        {
          (endpoints.length === 0) ? <Text>No devices Available</Text> :
            <View>
              {
                endpoints.map((endpoint, i) => (
                <View>
                <CheckBox
                  value={isSelected}
                  onValueChange={() => {
                    setSelection(!isSelected);
                    if (isSelected){
                      selectDevice([...selectedDevices, endpoint]);
                    } else {
                      selectDevice(selectedDevices.filter((device) => { 
                        return device !== endpoint; 
                      }));
                    }
                    console.log(selectedDevices);
                  }}
                />
                  <Text key={i}>{endpoint}</Text>
                </View>
              ))
            }
      </View>
        }
    </View>
    <Button
        onPress={sendMessageToSelectedDevices}
        title="Send Message"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View >
  );
}

// Try to use styled components here for defining the styles.
// https://styled-components.com/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
