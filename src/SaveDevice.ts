import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device } from 'react-native-ble-plx';
import { asyncDevices } from './screens/AvailableDevices';


export const setCurrentDevice = async (id: string, name: string) => {

    try {
        const value = await AsyncStorage.getItem(id);
        if (value !== null) {
            // Data exists
            console.log(`Data already exists:`, value);
        } else {
            // Data does not exist
            await AsyncStorage.setItem(id, name);
            console.log("Successfully Saved");
        }
    } catch (error) {
        console.error("Error reading AsyncStorage:", error);
    }
};



export const getCurrentDevice = async (key: string) => {
    try {
        const name = await AsyncStorage.getItem(key);

        const device: asyncDevices[] = [{
            name: name ? name : "Halsa Baby",
            id: key
        }];

        return device;
    } catch (e) {
        console.error("Error reading data", e);
    }
};
