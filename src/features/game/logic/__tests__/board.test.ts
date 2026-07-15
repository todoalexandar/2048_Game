import { describe, expect, it } from 'vitest'
import { addRandomTile, createEmptyBoard, createInitialBoard, getEmptyCells } from '../board'

describe('createEmptyBoard', () => {
  it('creates a 4x4 board of nulls by default', () => {
    const board = createEmptyBoard()

    expect(board).toHaveLength(4)
    board.forEach((row) => {
      expect(row).toHaveLength(4)
      row.forEach((cell) => expect(cell).toBeNull())
    })
  })
})

describe('createInitialBoard', () => {
  it('places between 2 and 4 tiles of value 2 on an otherwise empty board', () => {
    const board = createInitialBoard()
    const filledCells = board.flat().filter((cell) => cell !== null)

    expect(filledCells.length).toBeGreaterThanOrEqual(2)
    expect(filledCells.length).toBeLessThanOrEqual(4)
    filledCells.forEach((value) => expect(value).toBe(2))
  })
})

describe('addRandomTile', () => {
  it('adds exactly one tile with value 2 or 4 to an empty cell', () => {
    const board = createEmptyBoard()
    const next = addRandomTile(board)

    expect(getEmptyCells(next).length).toBe(getEmptyCells(board).length - 1)

    const addedValue = next.flat().find((cell) => cell !== null)
    expect([2, 4]).toContain(addedValue)
  })

  it('returns the board unchanged when there are no empty cells', () => {
    const fullBoard = Array.from({ length: 4 }, () => Array(4).fill(2))
    expect(addRandomTile(fullBoard)).toEqual(fullBoard)
  })
})
