"use client"

import React, { useState, useEffect } from 'react'
import { Share2 } from 'lucide-react'

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

const getDarkerOrLighterShade = (color: string, percent: number, isDarker: boolean) => {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + (isDarker ? -amt : amt),
    G = (num >> 8 & 0x00FF) + (isDarker ? -amt : amt),
    B = (num & 0x0000FF) + (isDarker ? -amt : amt)
  return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`
}

const Game: React.FC = () => {
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [grid, setGrid] = useState<string[][]>([])
  const [differentTile, setDifferentTile] = useState<[number, number]>([0, 0])
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore')
    if (storedHighScore) setHighScore(parseInt(storedHighScore))
  }, [])

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('highScore', score.toString())
    }
  }, [score, highScore])

  const startGame = () => {
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
    setLevel(1)
    generateGrid()
  }

  const generateGrid = () => {
    const gridSize = Math.min(level + 1, 12)
    const baseColor = getRandomColor()
    const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(baseColor))

    const [x, y] = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)]
    setDifferentTile([x, y])

    let differentColor
    if (level <= 6) {
      differentColor = getDarkerOrLighterShade(baseColor, 5, true)
    } else if (level <= 9) {
      differentColor = getDarkerOrLighterShade(baseColor, 5, Math.random() < 0.5)
    } else {
      differentColor = getDarkerOrLighterShade(baseColor, 5, false)
    }

    newGrid[x][y] = differentColor
    setGrid(newGrid)
  }

  const handleTileClick = (x: number, y: number) => {
    if (x === differentTile[0] && y === differentTile[1]) {
      setScore(score + 1)
      if (score + 1 >= 150) {
        winGame()
      } else if ((score + 1) % getRoundsPerLevel(level) === 0) {
        setLevel(level + 1)
      }
      generateGrid()
    } else {
      endGame()
    }
  }

  const getRoundsPerLevel = (level: number) => {
    if (level <= 3) return 5
    return 7 + (level - 4) * 2
  }

  const endGame = () => {
    setGameOver(true)
    showNotification(getNotificationMessage())
  }

  const winGame = () => {
    setGameOver(true)
    showNotification("Woo-hoo! Congratulations! You have eagle eyes! Share your achievement and invite friends to test their skills too!")
  }

  const showNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message)
    }
  }

  const getNotificationMessage = () => {
    if (score >= 150) return "Woo-hoo! Congratulations! You have eagle eyes!"
    const messages = [
      "You're so close! Try again and beat your high score!",
      "Just missed it! You've got what it takes, try again!",
      "Almost there! A few more tries and victory is yours!",
      "Don't stop now! The next level is waiting for you!",
      "Great effort! Keep going, the next challenge awaits you!",
      "You've mastered this far, now push through to the top!",
      "Your progress is amazing! Restart and climb even higher!",
      "Unstoppable! Try again, and conquer the toughest levels yet!",
      "Challenge accepted? Keep playing and dominate the leaderboard!",
      "Almost there! One more round and you'll break through!"
    ]
    return messages[Math.min(Math.floor(score / 15), messages.length - 1)]
  }

  const shareScore = () => {
    const message = `I just scored ${score} in Brainology 3.0! Can you beat my score? Play now: [Your Game URL]`
    if (navigator.share) {
      navigator.share({
        title: 'Brainology 3.0',
        text: message,
        url: window.location.href,
      })
    } else {
      alert('Sharing is not supported on this browser, but we appreciate your enthusiasm! Here\'s the message to share:\n\n' + message)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isDarkMode ? 'dark' : ''}`}>
      <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">Brainology 3.0</h2>
      {gameStarted && !gameOver && (
        <>
          <h4 className="text-xl mb-2 text-gray-700 dark:text-gray-300">Level: {level}</h4>
          <h3 className="text-2xl font-bold mb-4" style={{ color: `hsl(${Math.min(score / 150 * 120, 120)}, 100%, 50%)` }}>
            {score}
          </h3>
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}>
            {grid.map((row, x) =>
              row.map((color, y) => (
                <button
                  key={`${x}-${y}`}
                  className="w-12 h-12 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: color }}
                  onClick={() => handleTileClick(x, y)}
                />
              ))
            )}
          </div>
        </>
      )}
      {(!gameStarted || gameOver) && (
        <div className="text-center">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold mb-4"
            onClick={startGame}
          >
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
          {gameOver && (
            <>
              <p className="text-xl mb-2 text-gray-700 dark:text-gray-300">Game Over! Your score: {score}</p>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-full text-md font-semibold mb-4 flex items-center justify-center mx-auto"
                onClick={shareScore}
              >
                <Share2 className="mr-2" size={18} />
                Share Score
              </button>
            </>
          )}
        </div>
      )}
      <div className="mt-4 text-gray-600 dark:text-gray-400">High Score: {highScore}</div>
      {/* Ad space */}
      <div className="mt-8 w-full max-w-md h-20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
        Ad Space
      </div>
      {/* Theme toggle switch */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-200 dark:bg-gray-800 rounded-full p-1">
        <span className="text-sm mr-2 text-gray-700 dark:text-gray-300">Dark Mode</span>
        <div
          className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${isDarkMode ? 'bg-primary' : 'bg-gray-400'}`}
          onClick={toggleDarkMode}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">Made with ❤️ by H. Brave for the 🌏</p>
    </div>
  )
}

export default Game
