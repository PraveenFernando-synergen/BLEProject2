import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { BleError } from "react-native-ble-plx";
import { Device } from "react-native-ble-plx";
import Toast from "react-native-toast-message";
import { asyncDevices } from "../screens/AvailableDevices";

const manager = new BleManager();

const requestPermissions = async () => {
    console.log('Requesting permissions...');
    // if (Platform.OS === 'android' && Platform.Version >= 31) {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
    } else {
        console.log("Your android version is not compatible to use this feature")
        return false;
    }

    console.log('Permissions granted');
    return true;

};

var isScanning = false;

export const BleScan = async (onDeviceFind: any, searchStatus: (status: boolean) => void) => {

    StopBleScan();

    const permission = await requestPermissions();

    if (permission && !isScanning) {

        isScanning = true;

        console.log("Permissions granted, starting scan...");
        searchStatus(true)

        manager.startDeviceScan(null, null, (error, device) => {

            if (error) {

                searchStatus(false)

                console.log("Scan error:", error);

                Toast.show({
                    visibilityTime: 2000,
                    position: "top",
                    type: "error",
                    text1: `${error}`
                });

                return error;
            }

            if (device?.name) {
                onDeviceFind(device);
                console.log("Found device:", device.name, "Device ID:", device.id, "RSSI:", device.rssi);
                return device;
            }
        });

        setTimeout(() => {
            StopBleScan();
            searchStatus(false)
        }, 10000);

    } else {
        console.log("Permissions not granted");

    }
};

export const StopBleScan = () => {
    if (isScanning) {
        isScanning = false
        console.log("Stopping BLE scan...");
        manager.stopDeviceScan();
    }
};


var isConnect = false;

// logic to connect device
export const connectDevice = async (device: Device | asyncDevices, connectStatus: (id: string, status: boolean, name: string) => void) => {

    const disconnectListener = (deviceId: string) => {

        manager.onDeviceDisconnected(deviceId, (error: BleError | null, device: Device | null) => {
            if (error) {
                console.error(JSON.stringify(error, null, 4))
                console.log("Error disconnecting device:", error.message);
            }
            if (device) {
                console.info(JSON.stringify(device, null, 4))
                console.log("Device disconnected:", device.name, "Device ID:", device.id);

            }
        });

    }

    if (!isConnect) {

        isConnect = true;

        try {

            const connectedDevice = await manager.connectToDevice(device.id, { autoConnect: true });
            console.log("Connected")

            disconnectListener(device.id);
            
            const discoveredServices = await connectedDevice.discoverAllServicesAndCharacteristics();
            StopBleScan();

            if (discoveredServices != null) {
                connectStatus(device.id, true, device.name ? device.name : "Halsa Baby");
                console.log("Discovered all services and characteristics for device:", discoveredServices.name,);
            } else {
                connectStatus("", false, device.name ? device.name : "Halsa Baby");
                console.log("No services and characteristics discovered for device:", device.name);
            }

            return true;
        } catch (error) {


            deviceDisconnect(device.id);
            console.error("Connection error:", error);
            connectStatus(device.id, false, device.name ? device.name : "Halsa Baby");

            Toast.show({
                visibilityTime: 2000,
                position: "top",
                type: "error",
                text1: `${error}`
            });

            return error;
        }
    } else if (isConnect) {
        deviceDisconnect(device.id);
        isConnect = false
        connectStatus(device.id, false, device.name ? device.name : "Halsa Baby");
    }

}

export const deviceDisconnect = async (deviceId: string) => {

    try {

        const disconnectDevice = await manager.cancelDeviceConnection(deviceId);
        console.log("Device disconnected:", disconnectDevice.name, "Device ID:", disconnectDevice.id);

    } catch (error) {
        console.error("Error during disconnection:", error);

        Toast.show({
            visibilityTime: 2000,
            position: "top",
            type: "error",
            text1: `${error}`
        });

    }


}