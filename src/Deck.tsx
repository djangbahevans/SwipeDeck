import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Animated, Dimensions, LayoutAnimation, PanResponder, Platform, StyleSheet, UIManager, View } from "react-native"

const SCREEN_WIDTH = Dimensions.get("window").width
const SWIPE_THRESHOLD = .25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type Props = {
  data: { id: number, text: string, uri: string }[],
  renderCard(item: { id: number, text: string, uri: string }): ReactNode,
  renderNoMoreCards(): ReactNode
  onSwipeLeft?(item: { id: number, text: string, uri: string }): void,
  onSwipeRight?(item: { id: number, text: string, uri: string }): void,
}

const Deck = ({ data, renderCard, renderNoMoreCards, onSwipeLeft, onSwipeRight }: Props) => {
  const [index, setIndex] = useState(0)

  const position = useRef(new Animated.ValueXY()).current

  const onSwipeComplete = useCallback((direction: "left" | "right") => {
    const item = data[index]
    direction === "left" ? onSwipeLeft?.(item) : onSwipeRight?.(item)
    setIndex(index + 1)
    position.setValue({ x: 0, y: 0 })
  }, [index])

  const forceSwipe = useCallback((direction: "left" | "right") => {
    Animated.timing(position, {
      toValue: {
        x: direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH,
        y: 0
      },
      useNativeDriver: false,
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      onSwipeComplete(direction)
    })
  }, [onSwipeComplete])

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {
        x: 0,
        y: 0
      },
      useNativeDriver: false
    }).start()
  }

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 })
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right")
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left")
      } else {
        resetPosition()
      }
    },
  }), [forceSwipe])

  useEffect(() => {
    setIndex(0)
  }, [data])

  LayoutAnimation.configureNext({
    duration: 1000,
    update: {
      initialVelocity: 0,
      springDamping: .4,
      type: "spring"
    },
  })

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    })

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  const renderCards = () => {
    if (index >= data.length) {
      return renderNoMoreCards()
    }

    return data.map((item, i) => {
      if (i < index) return null

      return i === index
        ? (
          <Animated.View key={item.id}
            style={[getCardStyle(), styles.cardStyle, { zIndex: 2 }]}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        ) : (
          <Animated.View key={item.id} style={[styles.cardStyle, { zIndex: 1, top: (i - index) * 10 }]}>
            {renderCard(item)}
          </Animated.View>
        )
    }).reverse()
  }

  return (
    <View>
      {renderCards()}
    </View>
  )
}

const styles = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: SCREEN_WIDTH
  }
})

export default Deck
