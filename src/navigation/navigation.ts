import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type RootStackParamList={
    Home: undefined;
    DeviceDetails: undefined;
}

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'    
>;