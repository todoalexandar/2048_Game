import { describe, expect, it } from 'vitest'
import { evaluateBoard } from '../expectimax'
import { scoreBoard } from '../heuristics'
import type { Board } from '../../game/types'

describe('evaluateBoard', () => {
  it('equals scoreBoard directly at depth 0, since chanceTurn stops before spawning anything', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, null],
    ]

    expect(evaluateBoard(board, 0)).toBe(scoreBoard(board))
  })

  it('equals scoreBoard directly at negative depth', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, null],
    ]

    expect(evaluateBoard(board, -1)).toBe(scoreBoard(board))
  })

  it('equals scoreBoard directly on a full board, even at depth > 0, since there is nowhere to spawn', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]

    expect(evaluateBoard(board, 3)).toBe(scoreBoard(board))
  })

  it('scores a healthier board higher than a nearly-full, disordered one', () => {
    const healthy: Board = [
      [2, 4, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
    const cramped: Board = [
      [2, 1024, 4, 512],
      [1024, 2, 512, 4],
      [4, 512, 2, null],
      [512, 4, 1024, 2],
    ]

    expect(evaluateBoard(healthy, 2)).toBeGreaterThan(evaluateBoard(cramped, 2))
  })
})
