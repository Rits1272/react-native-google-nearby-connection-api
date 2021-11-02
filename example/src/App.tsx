import * as React from 'react';

import { StyleSheet, View, Text, NativeModules } from 'react-native';

const { NearbyConnection } = NativeModules;

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hey Dhananjay Bro :)</Text>
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
