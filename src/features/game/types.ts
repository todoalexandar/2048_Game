export type CellValue = number | null

export type Board = CellValue[][]

export type Direction = 'left' | 'right' | 'up' | 'down'

export type GameStatus = 'playing' | 'won' | 'lost'

export interface MoveResult {
  board: Board
  moved: boolean
  scoreGained: number
}
