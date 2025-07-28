import { PermissionsAndroid, Platform } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { BleError } from "react-native-ble-plx";
import { Device } from "react-native-ble-plx";
import Toast from "react-native-toast-message";

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
export const connectDevice = async (device: Device,connectStatus:(id: string, status: boolean)=>void) => {

    if (!isConnect) {

        isConnect = true;

        StopBleScan();

        console.log("Device Name:", device.name, "Device id: ", device.id, "RSSI:", device.rssi)

        try {

            const connectedDevice = await manager.connectToDevice(device.id);
            console.log("Connected")

            Toast.show({
                visibilityTime: 2000,
                position: "top",
                type: "success",
                text1: `Successfully Connected`
            });

            const discoveredServices = await connectedDevice.discoverAllServicesAndCharacteristics();
            if(discoveredServices!=null){
                connectStatus(device.id, true);
                console.log("Discovered all services and characteristics for device:", discoveredServices.name,);
            }else{
                connectStatus("", false);
                console.log("No services and characteristics discovered for device:", device.name);
            }

            return true;
        } catch (error) {


            deviceDisconnect(device.id);
            console.error("Connection error:", error);

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