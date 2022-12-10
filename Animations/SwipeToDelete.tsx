import React, { useCallback, useRef, useState } from 'react'
import { Text, StyleSheet, View, Dimensions } from 'react-native'
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerProps, ScrollView } from 'react-native-gesture-handler'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated'
import { FontAwesome } from '@expo/vector-icons'

const TITLES = [
  'Learn React Native Reanimated',
  'Learn swipe to delete',
  'Get better in mobile development',
  'Make awesome project for mobile',
  'Learn React Native Reanimated',
  'Learn swipe to delete',
  'Get better in mobile development',
  'Make awesome project for mobile',
  'Learn React Native Reanimated',
  'Learn swipe to delete',
  'Get better in mobile development',
  'Make awesome project for mobile',
]

interface TaskInterface {
  title: string,
  index: number
}

const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }))

const LIST_ITEM_HEIGHT = 70

const { width: SCREEN_WIDTH } = Dimensions.get('screen')

const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3

export const SwipeToDelete: React.FC = () => {
  const [tasks, setTasks] = useState(TASKS)

  const scrollRef = useRef(null)

  const osDismiss = useCallback((task: TaskInterface) => {
    setTasks(tasks.filter((myTask) => myTask.index !== task.index))
  }, [setTasks, tasks])

  return (
    <View style={[style.container]}>
      <Text style={[style.title]}>Tasks</Text>
      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((task) => (
          <ListItem simultaneousHandlers={scrollRef} onDismiss={osDismiss} task={task} key={task.index} />
        ))}
      </ScrollView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%'
  },
  task: {
    width: '90%',
    height: LIST_ITEM_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10
  },
  taskContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  taskTitle: {
    fontSize: 16,
  },
  iconContainer: {
    height: LIST_ITEM_HEIGHT,
    width: LIST_ITEM_HEIGHT,
    position: 'absolute',
    right: '10%',
    alignItems: 'center',
    justifyContent: 'center'

  }
})

interface ListItemProps extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  task: TaskInterface
  onDismiss: (task: TaskInterface) => void
}

const ListItem: React.FC<ListItemProps> = ({ task, onDismiss, simultaneousHandlers }) => {
  const translateX = useSharedValue(0)

  const itemHeight = useSharedValue(LIST_ITEM_HEIGHT)

  const marginVertical = useSharedValue(10)

  const opacity = useSharedValue(1)

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX
    },
    onEnd: () => {
      const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD
      if(shouldBeDismissed) {
        itemHeight.value = withTiming(0)
        translateX.value = withTiming(-SCREEN_WIDTH)
        marginVertical.value = withTiming(0)
        opacity.value = withTiming(0, undefined, (isFinished) => {
          if(isFinished) {
            runOnJS(onDismiss)(task)
          }
        })
      } else {
        translateX.value = withTiming(0)
      }
    }
  })

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }))

  const rIconStyle = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0)
    return {
      opacity
    }
  })

  const rTaskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: opacity.value
    }
  })

  return (
    <Animated.View style={[style.taskContainer, rTaskContainerStyle]}>
      <Animated.View style={[style.iconContainer, rIconStyle]}>
        <FontAwesome name='trash-o' size={LIST_ITEM_HEIGHT * 0.4} color='red' />
      </Animated.View>
      <PanGestureHandler simultaneousHandlers={simultaneousHandlers} onGestureEvent={panGesture}>
        <Animated.View style={[style.task, rStyle]}>
          <Text style={[style.taskTitle]}>{task.title}</Text>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  )
}