import React from 'react'
import { useSwipeable } from 'react-swipeable'

export const Swipeable = ({ children, ...props }) => {
  const [stopScroll, setStopScroll] = React.useState(false)
  const handlers = useSwipeable({
    onSwipeStart: () => setStopScroll(true),
    onSwiped: () => setTimeout(() => setStopScroll(false), 1500),
    ...props,
  })
  //<div {...handlers} style={{ touchAction: stopScroll ? 'none' : 'auto' }}>
  return <div {...handlers}>{children}</div>
}
