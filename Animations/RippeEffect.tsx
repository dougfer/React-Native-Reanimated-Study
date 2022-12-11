import React, { PropsWithChildren } from 'react'
import { Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import { TapGestureHandler, TapGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, { measure, runOnJS, useAnimatedGestureHandler, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export const RippeEffect: React.FC = () => {
  return (
    <View style={[style.container]}>
      <Ripple 
        onTap={() => {
          console.log('chamei aqui')
        }}
        style={[style.ripple]}
      >
        <Text style={[{ fontSize: 25 }]}>Tap</Text>
      </Ripple>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ripple: {
    width: 200,
    height: 200,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})

interface RippleProps {
  style?: StyleProp<ViewStyle>
  onTap?: () => void
}

const Ripple: React.FC<PropsWithChildren<RippleProps>> = ({ onTap, style, children }) => {

  const centerX = useSharedValue(0)
  const centerY = useSharedValue(0)
  const scale = useSharedValue(0)
  const aRef = useAnimatedRef<View>()

  const tapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {

      const layout = measure(aRef)

      console.log(layout)

      centerX.value = event.x
      centerY.value = event.y
      scale.value = 0
      scale.value = withTiming(1, { duration: 1000 })
    },
    onActive: () => {
      if(onTap) {
        runOnJS(onTap)()
      }
    },
    onEnd: () => {

    }
  })

  const rCircleStyle = useAnimatedStyle(() => {

    const width = 200
    const height = 200
    const circleRadius = Math.sqrt(width ** 2 + height ** 2)

    const translateX = centerX.value - circleRadius
    const translateY = centerY.value - circleRadius

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      backgroundColor: 'red',
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0.2,
      transform: [
        { translateX },
        { translateY },
        {
          scale: scale.value
        }
      ]
    }
  })

  return (
    <View ref={aRef}>
      <TapGestureHandler onGestureEvent={tapGestureEvent}>
        <Animated.View style={style}>
          <View>
            {children}
          </View>
          <Animated.View style={[rCircleStyle]} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  )
}