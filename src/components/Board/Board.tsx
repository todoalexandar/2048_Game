import { useAppSelector } from '../../app/hooks'
import { Tile } from '../Tile/Tile'
import styles from './Board.module.css'

export function Board() {
  const board = useAppSelector((state) => state.game.board)

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => <Tile key={`${rowIndex}-${colIndex}`} value={cell} />),
      )}
    </div>
  )
}
