import type { CSSProperties } from 'react'
import { useAppSelector } from '../../app/hooks'
import { Tile } from '../Tile/Tile'
import styles from './Board.module.css'

export function Board() {
  const board = useAppSelector((state) => state.game.board)
  const rows = board.length
  const cols = board[0].length

  return (
    <div
      className={styles.board}
      style={{ '--rows': rows, '--cols': cols } as CSSProperties}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => <Tile key={`${rowIndex}-${colIndex}`} value={cell} />),
      )}
    </div>
  )
}
