import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { newGameRequested } from '../../features/game/gameSlice'
import styles from './GameOverlay.module.css'

export function GameOverlay() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.game.status)

  if (status === 'playing') return null

  const isWon = status === 'won'

  return (
    <div className={styles.overlay}>
      <p className={styles.message}>{isWon ? 'You win!' : 'Game over'}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => dispatch(newGameRequested())}>
          New Game
        </button>
      </div>
    </div>
  )
}
