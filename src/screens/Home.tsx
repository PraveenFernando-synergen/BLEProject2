import React, { useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AvailableDevices from './AvailableDevices';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '../navigation/navigation';
import { StopBleScan } from '../bluetooth/BleScan';


function Home(): React.JSX.Element {

  const [getAvailableDevices, setAvailableDevices] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [getScanningStatus, setScanningStatus] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
      />
      <View style={styles.mainContainer}>
        <Text style={styles.mainHeading}>BLE Project</Text>
        <TouchableOpacity onPress={() => {
          setAvailableDevices(true);//to popup the model(AvailableDevices)
        }}>
          <View style={styles.scanButton}>
            <Text style={styles.buttonText}>Scan Devices Now</Text>
          </View>
        </TouchableOpacity>
        {getAvailableDevices && (
          <AvailableDevices
            isVisible={true}
            onClose={() => {
              setAvailableDevices(false);
              StopBleScan();
            }}
          />
        )}


        <Button title="Device Details" onPress={() => {
          navigation.navigate('DeviceDetails');
        }} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // paddingTop: 30, // Remove this line
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8764bc"
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scanButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#b816bbff',
    borderRadius: 5,
    width: 200, // Change from "100%" to a fixed width
    alignSelf: "center", // Ensure button is centered
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Home;
