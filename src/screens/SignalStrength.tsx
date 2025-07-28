import React from 'react';
import { View, StyleSheet } from 'react-native';

const SignalStrength = ({ rssi }: { rssi: number }) => {
  const level = getSignalLevel(rssi);

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((bar) => (
        <View
          key={bar}
          style={[
            styles.bar,
            { opacity: level >= bar ? 1 : 0.3, height: bar * 6 },
          ]}
        />
      ))}
    </View>
  );
};

const getSignalLevel = (rssi: number): number => {
  if (rssi >= -50 && rssi < -30) return 4;
  if (rssi >= -60 && rssi < -50) return 3;
  if (rssi >= -70 && rssi < -60) return 2;
  if (rssi > -90 && rssi < -70) return 1;
  if (rssi < -90) return 0;

  return 1;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
  },
  bar: {
    width: 4,
    backgroundColor: '#8764bc',
    borderRadius: 4,
  },
});

export default SignalStrength;
