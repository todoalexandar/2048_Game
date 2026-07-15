import type { Board, CellValue } from '../types'
import { BOARD_DIMENSIONS, INITIAL_TILE_COUNT_RANGE, NEW_TILE_IS_TWO_PROBABILITY } from './constants'

/** Creates a BOARD_DIMENSIONS.rows x BOARD_DIMENSIONS.cols grid of empty (null) cells. */
export function createEmptyBoard(
  rows: number = BOARD_DIMENSIONS.rows,
  cols: number = BOARD_DIMENSIONS.cols,
): Board {
  return Array.from({ length: rows }, () => Array<CellValue>(cols).fill(null))
}

/** Returns the array of [row, col] coordinates of every empty cell on the board. */
export function getEmptyCells(board: Board): Array<[number, number]> {
  const cells: Array<[number, number]> = []

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) cells.push([rowIndex, colIndex])
    })
  })

  return cells
}

/** Picks 2 or 4, weighted by NEW_TILE_IS_TWO_PROBABILITY. */
export function randomTileValue(): number {
  return Math.random() < NEW_TILE_IS_TWO_PROBABILITY ? 2 : 4
}

/** Returns a new board with a single cell set to value, without mutating the original. */
function setCell(board: Board, row: number, col: number, value: number): Board {
  const next = board.map((r) => [...r])
  next[row][col] = value
  return next
}

/** Picks one random empty cell, or null if the board is full. */
function randomEmptyCell(board: Board): [number, number] | null {
  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0) return null
  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

/** Places one new tile (2 or 4) in a random empty cell. Returns the board unchanged if full. */
export function addRandomTile(board: Board): Board {
  const cell = randomEmptyCell(board)
  if (!cell) return board

  const [row, col] = cell
  return setCell(board, row, col, randomTileValue())
}

/** Returns a random integer between min and max, inclusive. */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Seeds an empty board with a random number of `2` tiles at random cells (see constants.ts). */
export function createInitialBoard(): Board {
  let board = createEmptyBoard()
  const tileCount = randomInt(INITIAL_TILE_COUNT_RANGE.min, INITIAL_TILE_COUNT_RANGE.max)

  for (let i = 0; i < tileCount; i += 1) {
    const cell = randomEmptyCell(board)
    if (!cell) break
    const [row, col] = cell
    board = setCell(board, row, col, 2)
  }

  return board
}
