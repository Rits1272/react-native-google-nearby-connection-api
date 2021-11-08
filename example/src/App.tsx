import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, View, Text, NativeModules, Button, PermissionsAndroid } from 'react-native';

const { NearbyChat } = NativeModules;

export default function App() {

  useEffect(() => {
    requestAccessFineLocationPermission();
    requestAccessCoarseLocationPermission();
  });

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
    NearbyChat.startAdvertising("My-Phone");
  };

  const OnPressDiscover = () => {
    NearbyChat.startDiscovery("Your-Phone");
  };

  return (
    <View style={styles.container}>
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
