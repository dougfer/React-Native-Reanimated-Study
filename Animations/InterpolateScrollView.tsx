import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, } from 'react-native'
import Animated, { withSpring, useSharedValue, useAnimatedStyle, withTiming, useAnimatedScrollHandler } from 'react-native-reanimated'; 
import { Page } from '../components/Page'

const WORDS = ['This', 'is', 'my', 'animation']

export const InterpolateScrollView: React.FC = () => {
  const translateX = useSharedValue(0)

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x
  })

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
      <Animated.ScrollView 
        style={[styles.container]}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        >
        {WORDS.map((title, index) => <Page key={index} title={title} index={index} translateX={translateX} />)}
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  }
})