import * as React from 'react';
import { StyleSheet, View, Text, NativeModules, Button } from 'react-native';

const { NearbyChat } = NativeModules;

export default function App() {

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
