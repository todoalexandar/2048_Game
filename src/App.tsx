import { Board } from './components/Board/Board'
import { Controls } from './components/Controls/Controls'
import { GameOverlay } from './components/GameOverlay/GameOverlay'
import { ScoreBoard } from './components/ScoreBoard/ScoreBoard'
import { useKeyboardControls } from './features/game/hooks/useKeyboardControls'
import styles from './App.module.css'

function App() {
  useKeyboardControls()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>2048</h1>
        <ScoreBoard />
      </header>
      <Controls />
      <main className={styles.boardWrapper}>
        <Board />
        <GameOverlay />
      </main>
      <p className={styles.hint}>Use arrow keys or WASD to play.</p>
    </div>
  )
}

export default App
