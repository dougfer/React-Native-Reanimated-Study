import React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { withSpring, useSharedValue, useAnimatedStyle, useAnimatedGestureHandler } from 'react-native-reanimated'; 
import { PanGestureHandler as PanGesture, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'

const SIZE = 100
const CIRCLE_RADIUS = SIZE * 2

type ContextInterface = {
  translateX: number
  translateY: number
}

export const PanGestureHandler: React.FC = () => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextInterface>({
    onStart: (event, context) => {
      context.translateX = translateX.value
      context.translateY = translateY.value
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX
      translateY.value = event.translationY + context.translateY
      console.log(event.translationX)
    },
    onEnd: (event) => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2)

      if(distance < (CIRCLE_RADIUS + SIZE / 2) ) {
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
      }
    }
  })

  const reanimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }))

  return (
      <View style={[styles.circle]}>
      <PanGesture onGestureEvent={panGestureEvent}>
         <Animated.View style={[styles.square, reanimatedStyle]} />
       </PanGesture>
      </View>
  )
}

const styles = StyleSheet.create({
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0, 0, 256, 0.5)',
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: 'rgba(0, 0, 256, 0.5)',
  }
})