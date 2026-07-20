import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { suggestionReceived } from '../../features/ai/aiSlice'
import { suggestMove } from '../../features/ai/suggestMove'
import { newGameRequested } from '../../features/game/gameSlice'
import type { Direction } from '../../features/game/types'
import styles from './Controls.module.css'

const DIRECTION_LABEL: Record<Direction, string> = {
  up: 'Up',
  down: 'Down',
  left: 'Left',
  right: 'Right',
}

export function Controls() {
  const dispatch = useAppDispatch()
  const board = useAppSelector((state) => state.game.board)
  const status = useAppSelector((state) => state.game.status)
  const suggestion = useAppSelector((state) => state.ai.suggestion)

  const handleNewGame = (): void => {
    dispatch(newGameRequested())
  }

  const handleSuggest = (): void => {
    dispatch(suggestionReceived(suggestMove(board)))
  }

  return (
    <div className={styles.controls}>
      <button type="button" className={styles.button} onClick={handleNewGame}>
        New Game
      </button>
      <button
        type="button"
        className={styles.button}
        onClick={handleSuggest}
        disabled={status !== 'playing'}
      >
        Suggest Move
      </button>
      {suggestion && (
        <p className={styles.suggestion}>
          Best move: <strong>{DIRECTION_LABEL[suggestion]}</strong>
        </p>
      )}
    </div>
  )
}
