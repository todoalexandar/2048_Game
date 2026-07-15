import { useAppSelector } from '../../app/hooks'
import styles from './ScoreBoard.module.css'

interface ScoreTileProps {
  label: string
  value: number
}

function ScoreTile({ label, value }: ScoreTileProps) {
  return (
    <div className={styles.scoreTile}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

export function ScoreBoard() {
  const score = useAppSelector((state) => state.game.score)

  return (
    <div className={styles.scoreBoard}>
      <ScoreTile label="Score" value={score} />
    </div>
  )
}
