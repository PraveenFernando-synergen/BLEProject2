import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, ToastAndroid, Alert, ScrollView, Touchable, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import SignalStrength from './SignalStrength';
import Toast from 'react-native-toast-message';
import { BleScan, connectDevice, StopBleScan } from '../bluetooth/BleScan';
import { Device } from 'react-native-ble-plx';
import { getCurrentDevice, setCurrentDevice } from '../SaveDevice';


interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export type asyncDevices = {
    name: string,
    id: string,
}

const AvailableDevices: React.FC<Props> = ({ isVisible, onClose }) => {

    // getter and setter for connected device
    const [getConnectedDeviceId, setConnectedDeviceId] = useState<string | null>(null);

    // getter and setter for device connected status
    const [getConnectedStatus, setConnectedStatus] = useState<boolean>(false);

    // getter and setter for selected device
    const [getSelectedDevice, setSelectedDevice] = useState<string | null>(null);

    // current device
    const [gtLastConnectedDevice, setLastConnectedDevice] = useState<asyncDevices[]>([]);

    // scanning status
    const [getScanningDevices, setScanningDevices] = useState<boolean>(false);

    // Function to update scanning status
    const searchStatus = (status: boolean) => {
        setScanningDevices(status);
    }

    const connectStatus = (id: string, status: boolean) => {
        if (status) {
            Toast.show({
                visibilityTime: 2000,
                position: "top",
                type: "success",
                text1: `Connected to ${id}`
            });

            searchStatus(false);
            setConnectedDeviceId(id);
            setConnectedStatus(true);

        } else {
            setConnectedStatus(false);
            Toast.show({
                visibilityTime: 2000,
                position: "top",
                type: "error",
                text1: `Failed to connect to ${id}`
            });
        }
    }

    // getter and setter for available devices
    const [getDevices, setDevices] = useState<Device[]>([]);

    // Function to handle device found during scan
    const onDeviceFind = (device: Device) => {
        if (device.name && device.id) {
            setDevices((existDevice) => {
                if (existDevice.find(d => d.id === device.id)) {
                    return existDevice;
                }

                return [...existDevice, device];
            });
        }
    }

    const startScan = () => {
        setDevices([]); // Clear devices when the component mount
        BleScan(onDeviceFind, searchStatus); // Start scanning for devices when the component mounts
    }


    useEffect(() => {
        if (isVisible) {
            startScan(); // Start scanning when the component mounts
        }

    }, [isVisible]);

    useEffect(() => {

        setCurrentDevice("1012", "Halsa Baby");

        const fetchData = async () => {

            // get current device data from async storage
            const device = await getCurrentDevice("1012");

            // const deviceData: asyncDevices[] = [{
            //     name: device ? device : "Halsa Baby",
            //     id: "1012"
            // }];

            setLastConnectedDevice(device as asyncDevices[]);
            console.log("Current Device:", device);

        }

        fetchData();

    }, [])



    return (
        <View style={{ flex: 1 }}>

            <Modal
                isVisible={isVisible}
                onBackdropPress={onClose}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                style={styles.availableDeviceContainer}
                backdropOpacity={0.3}
                backdropColor='white'

            >
                <View style={styles.mainHolder}>


                    <View style={styles.headerContainer}>
                        <Text style={{ fontSize: 20 }}>Connect With Halsa Baby</Text>
                    </View>

                    <View style={styles.subHolder}>
                        {/* available device list */}
                        <FlatList contentContainerStyle={{ paddingBottom: 30 }} data={getDevices} keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={async () => {

                                    // set selected device id
                                    setSelectedDevice(item.id);
                                    // call the connectDevice function
                                    connectDevice(item, connectStatus);


                                }}>
                                    <View style={getSelectedDevice === item.id ? styles.selectedDeviceItem : styles.deviceItem}>
                                        <SignalStrength rssi={item.rssi ?? 1} />
                                        <View style={{ flex: 1, paddingLeft: 30 }}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                            <Text style={{ color: '#666' }}>{getSelectedDevice === item.id ? 'Connecting...' : 'Connect'}</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            )}

                            ListHeaderComponent={
                                <View style={{ padding: 16 }}>
                                    <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>Current Device</Text>

                                    {/* current connected device list */}
                                    <FlatList contentContainerStyle={{ paddingBottom: 30 }} data={gtLastConnectedDevice} keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => {
                                                setConnectedDeviceId(item.id);
                                                setSelectedDevice(item.id);
                                                Toast.show({
                                                    visibilityTime: 2000,
                                                    position: "top",
                                                    type: "success",
                                                    text1: `Connected to ${item.name}`
                                                });
                                            }}>
                                                <View style={getSelectedDevice === item.id ? styles.selectedDeviceItem : styles.deviceItem}>
                                                    <SignalStrength rssi={-70} />
                                                    <View style={{ flex: 1, paddingLeft: 30 }}>
                                                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                                                        <Text style={{ color: '#666' }}>{getSelectedDevice === item.id ? 'Connecting...' : 'Connect'}</Text>
                                                    </View>

                                                </View>
                                            </TouchableOpacity>



                                        )}

                                        ListEmptyComponent={
                                            <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                                <Text style={{ fontSize: 12, color: "gray", opacity: 0.5, fontStyle: "italic" }}>No Devices Found</Text>
                                            </View>
                                        }

                                    />

                                    <View style={styles.availableDeviceSection}>
                                        <Text style={{ fontSize: 16, color: '#666', marginRight: 10 }}>Available Devices</Text>
                                        {getScanningDevices && (
                                            <ActivityIndicator size="small" color="#8764bc" />)}
                                    </View>

                                </View>
                            }

                            ListEmptyComponent={
                                <View style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                    <Text style={{ fontSize: 12, color: "gray", opacity: 0.5, fontStyle: "italic" }}>No Devices Found</Text>
                                </View>
                            }

                        />


                    </View>

                </View>
                <View style={styles.buttonsHolder}>
                    <TouchableOpacity onPress={() => {

                        console.log(getScanningDevices)

                        if (getScanningDevices) {
                            StopBleScan();
                            setScanningDevices(false)
                        } else if (!getScanningDevices) {

                            setDevices([]); // Clear devices when scan is initiated
                            BleScan(onDeviceFind, searchStatus); // Start scanning for devices

                        }


                    }}>
                        <View style={styles.btnHolder}>
                            <Text style={styles.buttons}>{getScanningDevices ? "Stop" : "Scan"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { isVisible = false; onClose() }}>
                        <View style={styles.btnHolder}>
                            <Text style={styles.buttons}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}
export default AvailableDevices;

const styles = StyleSheet.create({
    availableDeviceContainer: {
        justifyContent: 'flex-end',
        margin: 0,
        bottom: 0,
    },
    headerContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        padding: 10
    },
    mainHolder: {
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "60%",
        flex: 1,
        backgroundColor: 'white',
        bottom: 0,

    },
    subHolder: {
        padding: 20,
        backgroundColor: 'white',

    },
    deviceItem: {
        padding: 10,
        paddingVertical: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedDeviceItem: {
        padding: 10,
        paddingVertical: 15,
        marginVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eeeeeeff',
        borderRadius: 10,
    },
    buttonsHolder: {
        width: "100%",
        backgroundColor: 'white',
        paddingBottom: 30,
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexDirection: "row"

    },
    buttons: {
        color: '#ffffffff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 0,
        width: "100%",
        padding: 10,
    },
    btnHolder: {
        paddingRight: 50,
        paddingLeft: 50,
        borderRadius: 50,
        backgroundColor: "#8764bc",
    },
    availableDeviceSection: {

        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 20,
    }
});
