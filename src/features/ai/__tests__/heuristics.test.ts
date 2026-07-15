import { describe, expect, it } from 'vitest'
import {
  cellsInOrderScore,
  maxValueInCornerBonus,
  neighborSimilarityScore,
  scoreBoard,
} from '../heuristics'
import type { Board } from '../../game/types'

describe('scoreBoard', () => {
  it('scores a sparser board higher than a more crowded one', () => {
    const sparse: Board = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
    const crowded: Board = [
      [2, 4, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(scoreBoard(sparse)).toBeGreaterThan(scoreBoard(crowded))
  })

  it('rewards keeping the largest tile in a corner', () => {
    const inCorner: Board = [
      [8, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
    const inCenter: Board = [
      [null, null, null, null],
      [null, 8, 2, null],
      [null, null, null, null],
      [null, null, null, null],
    ]

    expect(scoreBoard(inCorner)).toBeGreaterThan(scoreBoard(inCenter))
  })
})

describe('cellsInOrderScore', () => {
  it('gives no penalty to rows/columns that are strictly increasing or decreasing', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]

    expect(cellsInOrderScore(board)).toBe(0)
  })

  it('penalizes rows/columns that mix increases and decreases', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [16, 8, 4, 2],
      [2, 8, 4, 16],
      [2, 2, 2, 2],
    ]

    expect(cellsInOrderScore(board)).toBe(-8)
  })
})

describe('neighborSimilarityScore', () => {
  const smooth: Board = [
    [2, 4, 8, 16],
    [4, 8, 16, 32],
    [8, 16, 32, 64],
    [16, 32, 64, 128],
  ]
  const rough: Board = [
    [2, 1024, 4, 512],
    [1024, 2, 512, 4],
    [4, 512, 2, 1024],
    [512, 4, 1024, 2],
  ]

  it('penalizes a board with large value gaps between neighbors far more than a smooth one', () => {
    expect(neighborSimilarityScore(rough)).toBeLessThan(neighborSimilarityScore(smooth))
  })

  it('computes the exact penalty for these boards', () => {
    expect(neighborSimilarityScore(smooth)).toBe(-24)
    expect(neighborSimilarityScore(rough)).toBe(-192)
  })
})

describe('maxValueInCornerBonus', () => {
  it('rewards the largest tile sitting in a corner', () => {
    const board: Board = [
      [1024, 2, 4, 8],
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
    ]

    expect(maxValueInCornerBonus(board)).toBe(10)
  })

  it('gives no bonus when the largest tile is in the center', () => {
    const board: Board = [
      [2, 4, 8, 16],
      [4, 1024, 8, 16],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]

    expect(maxValueInCornerBonus(board)).toBe(0)
  })

  it('gives no bonus when the largest tile is on an edge but not a corner', () => {
    const board: Board = [
      [2, 1024, 4, 8],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128],
    ]

    expect(maxValueInCornerBonus(board)).toBe(0)
  })
})
