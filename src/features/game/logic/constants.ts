export const BOARD_DIMENSIONS = { rows: 4, cols: 4 }

export const WINNING_VALUE = 2048

/** Probability that a newly spawned tile is a 2 (vs. a 4). Matches the original 2048. */
export const NEW_TILE_IS_TWO_PROBABILITY = 0.9

/** Assumption: the spec only says "a random number" of 2s, so I seed 2-4 tiles. */
export const INITIAL_TILE_COUNT_RANGE = { min: 2, max: 4 } as const

export const ALL_DIRECTIONS = ['up', 'left', 'down', 'right'] as const
