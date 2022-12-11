import React, { useCallback } from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { Entypo } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'

type ContextProps = {
  translateX: number
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const THRESHOLD = SCREEN_WIDTH / 3

const BACKGROUND_COLOR = '#1e1e23'

export const PerspectiveMenu: React.FC = () => {

  const translateX = useSharedValue(0)



  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextProps>({
    onStart: (_, context) => {
      context.translateX = translateX.value
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX

    },
    onEnd: (event, context) => {
      if(translateX.value <= THRESHOLD) {
        translateX.value = withTiming(0)
      } else {
        translateX.value = withTiming(SCREEN_WIDTH / 2)
      }

    }
  })

  const rStyle = useAnimatedStyle(() => {

    const rotate = interpolate(translateX.value, 
      [0, SCREEN_WIDTH / 2], 
      [0 , -3],
      Extrapolate.CLAMP
      )

      const borderRadius = interpolate(translateX.value, 
        [0, SCREEN_WIDTH / 2], 
        [0 , 15],
        Extrapolate.CLAMP
        )

    return {
      transform: [
        { perspective: 100 },
        { translateX: translateX.value },
        { rotateY: `${rotate}deg` }
      ],
      borderRadius
    }
  })

  const onPress = useCallback(() => {
    if(translateX.value > 0) {
      translateX.value = withTiming(0)
    } else {
      translateX.value = withTiming(SCREEN_WIDTH / 2)
    }
  }, [])

  return (
    <SafeAreaView style={[style.container]}>
      <StatusBar style='inverted' translucent />
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[{ backgroundColor: 'white', flex: 1 }, rStyle]}>
          <Entypo 
            name="menu" 
            size={32} 
            color={BACKGROUND_COLOR}
            style={{ margin: 15 }}
            onPress={onPress}
          />
        </Animated.View>
      </PanGestureHandler>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: BACKGROUND_COLOR
  }
})
