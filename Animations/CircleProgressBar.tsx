import React, { useCallback, useEffect } from 'react'
import { Text, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { ReText } from 'react-native-redash'
import Svg, { Circle } from 'react-native-svg'

const BACKGROUND_COLOR = '#444b6f'
const BACKGROUND_STROKE_COLOR = '#303858'
const STROKE_COLOR = '#A6E1FA'

const { height, width } = Dimensions.get('window')

const CIRCLE_LENGTH = 1000

const R = CIRCLE_LENGTH / (2 * Math.PI)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const CircleProgressBar: React.FC = () => {

  const progressSharedValue = useSharedValue(0)

  const progressText = useDerivedValue(() => {
    return `${Math.floor(progressSharedValue.value * 100)}`
  })

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - progressSharedValue.value)
  }))

  const onPress = useCallback(() => {
    if(progressSharedValue.value > 0) {
      return progressSharedValue.value = withTiming(0, { duration: 4000 })
    }
    progressSharedValue.value = withTiming(1, { duration: 4000 })
  }, [])

  return (
    <View style={[style.container]}>
      <ReText style={[style.progressText]} text={progressText} />
      <Svg style={{
        transform: [{ rotate: '-90deg'}],
        position: 'absolute'
      }}>
        <Circle 
          cx={width/2} 
          cy={height/2} 
          r={R} 
          stroke={BACKGROUND_STROKE_COLOR} 
          strokeWidth={30}
        />
        <AnimatedCircle 
          cx={width/2} 
          cy={height/2} 
          r={R} 
          stroke={STROKE_COLOR} 
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedProps}
          strokeLinecap='round'
        />
      </Svg>
      <TouchableOpacity style={[style.button]} onPress={onPress}>
        <Text style={[style.bottomText]}>
          Touch MF
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  progressText: {
    fontSize: 80,
    color: 'rgba(256, 256, 256, 0.7)',
  },
  button: {
    bottom: 80,
    width: width * 0.7,
    height: 60,
    backgroundColor: BACKGROUND_STROKE_COLOR,
    position: 'absolute',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomText: {
    fontSize: 25,
    color: '#fff',
    letterSpacing: 2.0
  }
})
