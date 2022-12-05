import React from 'react'
import { View, Image, StyleSheet, Dimensions, } from 'react-native'
import { PinchGestureHandler as PinchHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const IMAGE_URI = 'https://images.unsplash.com/photo-1621569642780-4864752e847e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80'

const AnimatedImage = Animated.createAnimatedComponent(Image)

const { height, width } = Dimensions.get('window')

export const PinchGestureHandler: React.FC = () => {

  const scale = useSharedValue(1)
  const focalX = useSharedValue(0)
  const focalY = useSharedValue(0)

   const pinchHandler = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
    onActive: (event) => {
      if(event.scale > 1) {
        scale.value = event.scale
      }
      focalX.value = event.focalX
      focalY.value = event.focalY
    },
    onEnd: () => {
      scale.value = withTiming(1)
    }
   })

   const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value }, 
        { translateY: focalY.value },
        { translateX: -width / 2 },
        { translateY: -height / 2 },
        { scale: scale.value },
        { translateX: -focalX.value }, 
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ]
    }
   })

   const focalPointStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: focalX.value }, { translateY: focalY.value }]
   }))

  return (
    <PinchHandler onGestureEvent={pinchHandler}>
      <Animated.View style={{ flex: 1, width: '100%', height: '100%' }}>
        <AnimatedImage style={[{ flex: 1, width: '100%', height: '100%' }, rStyle]} source={{ uri: IMAGE_URI }} />
        <Animated.View style={[style.focalPoint, focalPointStyle]} />
      </Animated.View>
    </PinchHandler>
  )
}


const style = StyleSheet.create({
  focalPoint: {
    ...StyleSheet.absoluteFillObject,
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10
  }
})