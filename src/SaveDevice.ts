import AsyncStorage from '@react-native-async-storage/async-storage';
import { Device } from 'react-native-ble-plx';
import { asyncDevices } from './screens/AvailableDevices';


export const setCurrentDevice = async (id: string, name: string) => {

    try {
        const value = await AsyncStorage.getItem('current_device');
        if (value !== null&& JSON.parse(value).id===id) {
            // Data exists
            console.log(`Data already exists:`, value);
        } else {
            // Data does not exist
            const device={'id':id,'name':name};
            await AsyncStorage.setItem('current_device', JSON.stringify(device));
            console.log("Successfully Saved");
        }
    } catch (error) {
        console.error("Error reading AsyncStorage:", error);
    }
};

export const getCurrentDevice = async () => {
    try {
        const value = await AsyncStorage.getItem('current_device');

         if (value) {
            const device: asyncDevices = JSON.parse(value);
            return [device];
        }

    } catch (e) {
        console.error("Error reading data", e);
    }
};
