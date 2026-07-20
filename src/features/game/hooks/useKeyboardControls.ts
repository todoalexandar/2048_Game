import { useEffect } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { moveRequested } from '../gameSlice'
import type { Direction } from '../types'

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
}

/** Wires arrow keys and WASD to dispatching a move. */
export function useKeyboardControls(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const direction = KEY_TO_DIRECTION[event.key.toLowerCase()]
      if (!direction) return
      event.preventDefault()
      dispatch(moveRequested(direction))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch])
}
