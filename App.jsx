import React from 'react';
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import { PanGestureHandler, InterpolateScrollView, InterpolateColors, PinchGestureHandler, Taps, ColorPicker, CircleProgressBar } from './Animations'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <CircleProgressBar />
        </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
