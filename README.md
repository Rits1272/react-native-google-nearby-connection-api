# react-native-nearby-connections

A react-native wrapper for Google's Nearby Connection API

## Motivation
A react-native app that discovers and advertises to nearby devices and is able to send messages to each other peer-to-peer. We can try to build a clean UI to demonstrate this package.

## Installation

```sh
yarn install react-native-nearby-connections
```

## Documentation

 - startAdvertising(string name) : Start advertising to the nearby devices. `name` is the human readable name displayed to the nearby devices
 - startDiscovery(string name) : Start discovering nearby devices
 - sendMessage(string endpointId, string message) : Send message to the nearby devices
 - DeviceEventEmitter.addListener("endpoints", endpointList); // callback to get updates on the nearby devices
 - DeviceEventEmitter.addListener("message", receiveMessage); // callback to receive message from the nearby devices

You can further see the comments [here](https://github.com/Rits1272/react-native-google-nearby-connection-api/blob/master/example/android/app/src/main/java/com/example/reactnativenearbyconnections/ConnectionModule.java) to know more about above methods

You can refer https://gitlab.com/aossie/p2p-messaging-react-native/-/tree/main to see how we different things are working on the react-native side.
