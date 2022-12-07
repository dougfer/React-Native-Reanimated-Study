import React, { useCallback } from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import { PanGestureHandler, PanGestureHandlerGestureEvent, TapGestureHandler, TapGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import Animated, { interpolateColor, interpolateColors, useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'

const COLORS = [
  'red',
  'purple',
  'blue',
  'cyan',
  'green',
  'yellow',
  'orange',
  'black',
  'white'
]

const BACKGROUND_COLOR = 'rgba(0,0,0,0.9)'

const { width } = Dimensions.get('window')

const PICKER_WIDTH = width * 0.9
const CIRCLE_SIZE = width * 0.8
const CIRCLE_PICKER_SIZE = 45
const INTERNAL_PICKER_SIZE = CIRCLE_PICKER_SIZE / 1.5

export const ColorPicker: React.FC = () => {

  const pickedColor = useSharedValue<string | number>(COLORS[0])

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: pickedColor.value
  }))

  const onColorChanged = useCallback((color: string | number) => {
    'worklet'
    pickedColor.value = color
  }, [])

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <View style={[style.topContainer]}>
        <Animated.View style={[style.circle, rStyle]} />
      </View>
      <View style={[style.bottomContainer]}>
        <ColorPickerComponent
         colors={COLORS} 
         start={{ x: 0, y: 0 }}
         end={{ x: 1, y: 0 }}
         style={[style.gradient]}
         onColorChanged={onColorChanged}
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  topContainer: {
    flex: 3,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  gradient: {
    height: 40,
    width: PICKER_WIDTH,
    borderRadius: 20
  },
  picker: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: CIRCLE_PICKER_SIZE,
    height: CIRCLE_PICKER_SIZE,
    borderRadius: CIRCLE_PICKER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  internalPicker: {
    position: 'absolute',
    width: INTERNAL_PICKER_SIZE,
    height: INTERNAL_PICKER_SIZE,
    borderRadius: INTERNAL_PICKER_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(0 ,0, 0, 0.2)'
  },
  circle: {
    height: CIRCLE_SIZE,
    width: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  }
})

interface ColorPickerComponentProps extends LinearGradientProps {
  onColorChanged: (color: string | number) => void
}

type ContextInterface = {
  translateX: number
}

const ColorPickerComponent: React.FC<ColorPickerComponentProps> = ({ onColorChanged ,...props }) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1)

  const adjustedTranslateX = useDerivedValue(() => {
    return Math.min(Math.max(translateX.value, 0), (PICKER_WIDTH - CIRCLE_PICKER_SIZE))
  })

  const onEnd = useCallback(() => {
    'worklet'
    translateY.value = withSpring(0)
    scale.value = withSpring(1)
  }, [])

  const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, ContextInterface>({
    onStart: (_, context) => {
      context.translateX = adjustedTranslateX.value
    },
    onActive: (event, context) => {
      console.log(event.translationX)
      translateX.value = event.translationX + context.translateX
    },
    onEnd
  })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: adjustedTranslateX.value }, { scale: scale.value }, { translateY: translateY.value }]
  }))

  const rInternalPickerStyle = useAnimatedStyle(() => {

    const inputRange = props.colors.map((_, index) => (index / props.colors.length) * PICKER_WIDTH)

    const backgroundColor = interpolateColor(translateX.value, 
    inputRange, 
    props.colors
    )

    onColorChanged(backgroundColor)
    return {backgroundColor,}
  })

  const tapGestureEvent = useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
    onStart: (event) => {
      translateY.value = withSpring(-CIRCLE_PICKER_SIZE)
      scale.value = 1.2
      translateX.value = withTiming(event.absoluteX - CIRCLE_PICKER_SIZE)
    },
    onEnd
  })

  return (
    <TapGestureHandler onGestureEvent={tapGestureEvent}>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={{ justifyContent: 'center' }}>
            <LinearGradient 
              {...props}
            />
            <Animated.View style={[style.picker, rStyle]}>
              <Animated.View style={[style.internalPicker, rInternalPickerStyle]} /> 
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  )
}