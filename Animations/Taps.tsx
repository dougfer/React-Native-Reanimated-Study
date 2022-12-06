import React, { useCallback, useRef } from 'react'
import { Text, Image, View, StyleSheet, Dimensions, ImageBackground } from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated'

const AnimatedImage = Animated.createAnimatedComponent(Image)

export const Taps: React.FC = () => {

  const scale = useSharedValue(0)
  const opacity = useSharedValue(1)

  const doubleTapRef = useRef()

  const rStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: Math.max(scale.value, 0) }
    ]
  }))

  const rTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const onSingleTap = useCallback(() => {
    opacity.value = withTiming(0, undefined, (isFinished) => {
      if(isFinished) {
        opacity.value = withDelay(500, withSpring(1))
      }
    })
  }, [])


  const onDoubleTap = useCallback(() => {
    // 'worklet'
    scale.value = withSpring(1, undefined, (isFinished) => {
      if(isFinished) {
        scale.value = withDelay(500, withSpring(0))
      }
    })
  }, [])

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <TapGestureHandler
      waitFor={doubleTapRef}
        onActivated={onSingleTap}
      >
        <TapGestureHandler
          maxDelayMs={250}
          ref={doubleTapRef}
          numberOfTaps={2} 
          onActivated={onDoubleTap}>
            <Animated.View>
              <ImageBackground style={[style.image]} source={require('../assets/image.jpg')}>
                  <AnimatedImage 
                    source={require('../assets/like.png')} 
                    style={[[style.image, { 
                      shadowOffset: { width: 0, height: 20 }, 
                      shadowOpacity: 0.5,
                      shadowRadius: 50,
                    }], rStyle]}
                    resizeMode='center'
                  />
              </ImageBackground>
              <Animated.Text style={[style.turtle, rTextStyle]}>🐢🐢🐢🐢🐢🐢🐢</Animated.Text>
            </Animated.View>
        </TapGestureHandler>
      </TapGestureHandler>
    </View>
  )
}

const { width: SIZE } = Dimensions.get('window')

const style = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE
  },
  turtle: {
    fontSize: 35,
    textAlign: 'center',
    marginTop: 20 
  }
})