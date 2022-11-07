import React from 'react'
import { View, Dimensions, StyleSheet, Text } from 'react-native'
import Animated, { withSpring, useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated'; 

interface PageProps {
  title: string
  index: number
  translateX: Animated.SharedValue<number>
}

const { width, height } = Dimensions.get('window')

const SIZE = width * 0.7

export const Page: React.FC<PageProps> = ({ index, title, translateX }) => {

  const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(translateX.value, 
      inputRange, 
      [0, 1 , 0],
      Extrapolate.CLAMP
      )

    const borderRadius = interpolate(translateX.value, 
      inputRange, 
      [0, SIZE / 2 , 0],
      Extrapolate.CLAMP
      )
    return {
      transform: [
      {scale}
    ],
    borderRadius
  }
  })

  const rTextStyle = useAnimatedStyle(() => {
    const translateY = interpolate(translateX.value,
      inputRange,
      [height / 200,0, -height / 2],
      Extrapolate.CLAMP
      )

    const opacity = interpolate(translateX.value,
      inputRange,
      [-2,1,-2],
      Extrapolate.CLAMP)

    return {
      transform: [
        { translateY },
      ],
      opacity
    }
  })

  return (
    <View style={[styles.pageContainer, { backgroundColor: `rgba(0, 0, 256, 0.${index + 2})` }]}>
      <Animated.View style={[styles.square, rStyle]}>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute' }, rTextStyle]}>
        <Text style={styles.text}>{title}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  pageContainer: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: 'rgba(0, 0, 256, 0.4)'
  },
  text: {
    fontSize: 70,
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: '700'
  }
})