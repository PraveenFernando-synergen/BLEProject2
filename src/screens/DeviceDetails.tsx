import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { HomeScreenNavigationProp } from '../navigation/navigation';

const DeviceDetailsScreen = ( ) => {

     const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Details</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />

      <View style={styles.card}>
        <Text style={styles.label}>Name: <Text style={styles.value}></Text></Text>
        <Text style={styles.label}>ID: <Text style={styles.value}></Text></Text>
        <Text style={styles.label}>RSSI: <Text style={styles.value}> dBm</Text></Text>
        <Text style={styles.label}>Status: <Text style={styles.value}>{true? 'Connected' : 'Disconnected'}</Text></Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.buttonOutline} onPress={() => console.log("Refresh")}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSolid} onPress={() => console.log("Disconnect")}>
          <Text style={styles.buttonTextWhite}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeviceDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#f1f1f1',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 6,
  },
  value: {
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    padding: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  buttonSolid: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 12,
    flex: 0.45,
    alignItems: 'center',
  },
  buttonText: {
    color: '#007bff',
    fontWeight: '600',
  },
  buttonTextWhite: {
    color: '#fff',
    fontWeight: '600',
  },
});
