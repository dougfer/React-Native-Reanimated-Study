import React, { useState } from 'react'
import { View, Switch, StyleSheet, Dimensions, Text } from 'react-native'
import Animated, { interpolateColor, useSharedValue, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated'
import { StatusBar } from 'expo-status-bar'

const colors = {
  dark: {
    background: '#1E1E1E',
    circle: '#252525',
    text: '#F8F8F8'
  },
  light: {
    background: '#F8F8F8',
    circle: '#fff',
    text: '#1E1E1E'
  }
}

const SWITCH_TRACK_COLOR = {
  true: 'rgba(256, 0, 256, 0.2)',
  false: 'rgba(0, 0, 0, 0.1)'
}

type Theme = 'light' | 'dark'

export const InterpolateColors: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light')
  // const progress = useSharedValue(0)
  const progress = useDerivedValue(() => {
    return theme === 'dark'? withTiming(1) : withTiming(0)
  }, [theme])



  const rStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value,
      [0, 1],
      [colors.light.background, colors.dark.background]
      )

    return {
      backgroundColor
    }
  })

  const rCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(progress.value,
      [0, 1],
      [colors.light.circle, colors.dark.circle]
      )

    return {
      backgroundColor
    }
  })

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value,
      [0, 1],
      [colors.light.text, colors.dark.text]
      )

    return {
      color
    }
  })

  return (
    <Animated.View style={[styles.container, rStyle]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Animated.Text style={[styles.text, textStyle]}>Theme</Animated.Text>
      <Animated.View style={[styles.circle, rCircleStyle]}>
        <Switch value={theme === 'dark'} onValueChange={(toggled) => {
          setTheme(toggled ? 'dark' : 'light')
        }} 
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor={'violet'}
        />
      </Animated.View>
    </Animated.View>
  )
}

const SIZE = Dimensions.get('window').width * 0.7

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circle: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZE / 2,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 20
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor : "#ffff"

  },
  text: {
    fontSize: 70, 
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 14,
    marginBottom: 35

  }
})