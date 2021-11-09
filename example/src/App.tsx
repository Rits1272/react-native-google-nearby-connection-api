import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, 
         View, 
         Text, 
         NativeModules, 
         Button, 
         PermissionsAndroid, 
         DeviceEventEmitter, 
         CheckBox, 
         ScrollView, 
         TextInput,
         TouchableOpacity,
         Dimensions,
         Alert,
         FlatList} from 'react-native';

const { NearbyChat } = NativeModules;

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {

  useEffect(() => {
    requestAccessFineLocationPermission();
    requestAccessCoarseLocationPermission();
  });

  const [deviceName, setDeviceName] = useState('');
  const [endpoints, setEndpoints] = useState([]);
  const [isSelected, setSelection] = useState([]);
  const [isDeviceSelected, setIsDeviceSelected] = useState([]);
  const [refresh, setRefresh] = useState();
  const [message, setMessage] = useState("");

  const getEndpoints = (event) => {
    setEndpoints(event);
    const diff = endpoints.length - isDeviceSelected.length;
    for(let i = 0; i < diff; i++) {
      isDeviceSelected.push(false);
    }
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
    Alert.alert("Received the message", msg);
    console.log("This is the msg", msg);
  }

  const sendMessageToSelectedDevices = () => {
    isDeviceSelected.map((active, index) => {
      if(active) {
        const device = endpoints[index];
        const deviceId = device.split("_")[0];
        NearbyChat.sendMessage(deviceId, message);
      }
    });
    setMessage("");
  }

  const toggleDeviceSelection = (index) => {
    let active = isSelected[index];
    let tempIsSelected = isSelected;
    tempIsSelected[index] = !active;
    setIsDeviceSelected(tempIsSelected);
    setRefresh(Math.random(10000)); // a work around to rerender the endpoint list
  }

  const renderDeviceList = ({index, item}) => {
    let color = isSelected[index] ? '#007AFF' : '#d3d3d3';
    return (
      <TouchableOpacity 
        onPress={() => toggleDeviceSelection(index)}
        style={[styles.card, { backgroundColor: color }]}>
        <Text style={styles.deviceName} key={index}>{item.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }

  DeviceEventEmitter.addListener("endpoints", getEndpoints);
  DeviceEventEmitter.addListener("message", receiveMessage);

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, {paddingBottom: 12, borderBottomWidth: 0.5}]}>NEARBY CHAT</Text>
      <View style={styles.subcontainer}>
        <View style={styles.buttonContainer}>
          <Button title="Advertise" color="#007AFF" onPress={OnPressAdvertise}/>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Discover" color="#007AFF" onPress={OnPressDiscover}/>
        </View>
      </View>
      <View style={styles.deviceContainer}>
        <Text style={styles.heading}>Available Devices</Text>
        {endpoints.length > 0 ? 
        <ScrollView horizontal={true}>
          {
            endpoints.map((device, index) => {
              const color = isSelected[index] ? 'blue': '#a9a9a9';
              return (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => toggleDeviceSelection(index)}
                    style={[styles.card, { backgroundColor: color }]}>
                    <Text style={styles.deviceName}>{device.toUpperCase()}</Text>
                  </TouchableOpacity>
                )
            })
          }
        </ScrollView>
        :
        <Text style={styles.message}>No nearby devices found 🥺</Text>
      }
      </View>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          onChangeText={text => setMessage(text)}
          value={message}
          placeholder="Send a message"/>
        <Button title="Send" color="#007AFF" onPress={sendMessageToSelectedDevices} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '5%',
  },
  subcontainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    padding: '4%',
    marginTop: 8,
  },
  deviceContainer: {
    marginTop: 10,
    flex: 0.5,
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
  },
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 20,
    marginLeft: 40,
    marginRight: 40,
    flex: 1,
  },
  input: {
    borderRadius: 5,
    borderWidth: 0,
    elevation: 3,
    padding: 15,
    marginBottom: 20,
  },
  card: {
    height: 'auto',
    width: SCREEN_WIDTH * 0.8,
    margin: 10,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderRadius: 5,
  },
  deviceName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    fontSize: 20,
    color: 'red',
    marginTop: 50,
  }
});
