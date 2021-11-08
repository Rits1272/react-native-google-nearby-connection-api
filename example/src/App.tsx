import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, NativeModules, Button, PermissionsAndroid, TextInput, DeviceEventEmitter } from 'react-native';

const { NearbyChat } = NativeModules;

export default function App() {

  useEffect(() => {
    requestAccessFineLocationPermission();
    requestAccessCoarseLocationPermission();
  });

  const [deviceName, setDeviceName] = useState('');
  const [endpoints, setEndpoints] = useState([]);

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

  DeviceEventEmitter.addListener("endpoints", getEndpoints);

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
          (endpoints.length===0)?<Text>No devices Available</Text>:
          <View>
            {
              endpoints.map((endpoint, i) => (
                <Text key={i}>{endpoint}</Text>
              ))
            }
          </View>
        }
    </View>
    </View>
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
