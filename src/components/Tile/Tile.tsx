import type { CellValue } from '../../features/game/types'
import styles from './Tile.module.css'

const MAX_STYLED_VALUE = 2048

interface TileProps {
  value: CellValue
}

function tileClassName(value: number): string {
  if (value > MAX_STYLED_VALUE) return styles.tileMax
  return styles[`tile${value}`] ?? styles.tileMax
}

export function Tile({ value }: TileProps) {
  if (value === null) {
    return <div className={styles.tile} />
  }

  return (
    <div className={`${styles.tile} ${tileClassName(value)}`} data-testid="tile" data-value={value}>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
