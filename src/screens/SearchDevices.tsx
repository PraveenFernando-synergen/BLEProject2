import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const requestPermissions = async () => {
  console.log('Requesting permissions...');
  if (Platform.OS === 'android' && Platform.Version >= 31) {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
  }

  console.log('Permissions granted');
  return true;

};

const manager = new BleManager();

const scanDevices = () => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.log("Scan error:", error);
      return;
    }

    if (device?.name) {
      console.log("Found device:", device.name);

    }
  });
}

function SearchDevices(): React.JSX.Element {

  useEffect(() => {
    const init = async () => {
      const result = await requestPermissions();
      if (result) {
        console.log("Granted");
      }
    };
    init();

  }, []);

  return (
    <View>
      <Text>Search Devices</Text>
    </View>)

}

// const startScan = () => {
//   manager.startDeviceScan(null, null, async (error, device) => {
//     if (error || !device) return;

//     // Prevent duplicates
//     setDevices((prevDevices) => {
//       const exists = prevDevices.some((d) => d.id === device.id);
//       if (!exists) {
//         return [...prevDevices, device].sort((a, b) => (b.rssi ?? -100) - (a.rssi ?? -100));
//       }
//       return prevDevices;
//     });

//     // Auto-connect if it's a known device
//     const known = await AsyncStorage.getItem(device.id);
//     if (known && !connectedDeviceIds.has(device.id)) {
//       try {
//         const connected = await device.connect();
//         setConnectedDeviceIds((prev) => new Set(prev).add(device.id));
//         console.log(`Connected to ${device.name}`);
//       } catch (e) {
//         console.warn(`Connection failed: ${device.name}`, e);
//       }
//     }
//   });

//   setTimeout(() => manager.stopDeviceScan(), 10000); // Stop after 10 seconds
// };

// const connectToDevice = async (device) => {
//   try {
//     const connectedDevice = await device.connect();
//     await AsyncStorage.setItem(device.id, 'connected');
//     setConnectedDeviceIds((prev) => new Set(prev).add(device.id));
//     console.log('Connected to', device.name);
//   } catch (error) {
//     console.warn('Failed to connect', error);
//   }
// };

// return (
//   <View>
//     <FlatList
//       data={devices}
//       keyExtractor={(item) => item.id}
//       renderItem={({ item }) => (
//         <TouchableOpacity onPress={() => connectToDevice(item)}>
//           <Text>
//             {item.name || 'Unknown'} - RSSI: {item.rssi}
//           </Text>
//         </TouchableOpacity>
//       )}
//     />
//   </View>
// );

export default SearchDevices;
