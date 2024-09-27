document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const gameContent = document.getElementById("game-content");
  const startButton = document.getElementById("start-button");
  const highScoreDisplay = document.getElementById("high-score");
  const themeToggle = document.getElementById("theme-toggle");
  const toggleIndicator = document.getElementById("toggle-indicator");

  let level = 1;
  let score = 0;
  let highScore = 0;
  let gameStarted = false;
  let gameOver = false;
  let grid = [];
  let differentTile = [0, 0];
  let isDarkMode = true;

  // Initialize High Score from localStorage
  highScore = localStorage.getItem("highScore") || 0;
  highScoreDisplay.textContent = `High Score: ${highScore}`;

  // Set Dark Mode by default
  document.documentElement.classList.add("dark");

  // Event Listeners
  startButton.addEventListener("click", startGame);
  themeToggle.addEventListener("click", toggleDarkMode);

  function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    level = 1;
    updateScoreDisplay();
    generateGrid();
    gameContent.innerHTML = '';
    renderGame();
  }

  function generateGrid() {
    const gridSize = Math.min(level + 1, 12);
    const baseColor = getRandomColor();
    grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(baseColor));

    const [x, y] = [Math.floor(Math.random() * gridSize), Math.floor(Math.random() * gridSize)];
    differentTile = [x, y];

    let differentColor;
    if (level <= 6) {
      differentColor = getDarkerOrLighterShade(baseColor, 5, true);
    } else if (level <= 9) {
      differentColor = getDarkerOrLighterShade(baseColor, 5, Math.random() < 0.5);
    } else {
      differentColor = getDarkerOrLighterShade(baseColor, 5, false);
    }

    grid[x][y] = differentColor;
  }

  function renderGame() {
    const gridSize = grid.length;
    gameContent.innerHTML = `
      <h4 class="text-xl mb-2 text-gray-700 dark:text-gray-300">Level: ${level}</h4>
      <h3 class="text-2xl font-bold mb-4" style="color: hsl(${Math.min(score / 150 * 120, 120)}, 100%, 50%)">${score}</h3>
      <div class="grid gap-2" style="grid-template-columns: repeat(${gridSize}, minmax(0, 1fr))">
        ${grid.map((row, x) =>
          row.map((color, y) =>
            `<button class="w-12 h-12 rounded-lg transition-colors duration-200" style="background-color: ${color}" onclick="handleTileClick(${x}, ${y})"></button>`
          ).join('')
        ).join('')}
      </div>
    `;
  }

  function handleTileClick(x, y) {
    if (x === differentTile[0] && y === differentTile[1]) {
      score++;
      if (score >= 150) {
        winGame();
      } else if ((score + 1) % getRoundsPerLevel(level) === 0) {
        level++;
      }
      generateGrid();
      renderGame();
    } else {
      endGame();
    }
  }

  function getRoundsPerLevel(level) {
    return level <= 3 ? 5 : 7 + (level - 4) * 2;
  }

  function endGame() {
    gameOver = true;
    showNotification(getNotificationMessage());
    gameContent.innerHTML = `
      <button class="px-6 py-3 bg-blue-500 text-white rounded-full text-lg font-semibold mb-4" onclick="startGame()">Play Again</button>
      <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">Game Over! Your score: ${score}</p>
      <button class="px-4 py-2 bg-green-500 text-white rounded-full text-md font-semibold mb-4" onclick="shareScore()">Share Score</button>
    `;
    updateHighScore();
  }

  function winGame() {
    endGame();
    showNotification("Woo-hoo! Congratulations! You have eagle eyes! Share your achievement and invite friends to test their skills too!");
  }

  function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreDisplay.textContent = `High Score: ${highScore}`;
    }
  }

  function updateScoreDisplay() {
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }

  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  function getDarkerOrLighterShade(color, percent, isDarker) {
    const num = parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + (isDarker ? -amt : amt),
      G = (num >> 8 & 0x00FF) + (isDarker ? -amt : amt),
      B = (num & 0x0000FF) + (isDarker ? -amt : amt);
    return `#${(1 << 24 | (R < 255 ? R < 1 ? 0 : R : 255) << 16 | (G < 255 ? G < 1 ? 0 : G : 255) << 8 | (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)}`;
  }

  function getNotificationMessage() {
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
      "Almost there! One more round and you'll break through!",
    ];
    return messages[Math.min(Math.floor(score / 15), messages.length - 1)];
  }

  function showNotification(message) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(message);
    }
  }

  function shareScore() {
    const message = `I just scored ${score} in Brainology 3.0! Can you beat my score? Play now: [Your Game URL]`;
    if (navigator.share) {
      navigator.share({
        title: "Brainology 3.0",
        text: message,
        url: window.location.href,
      });
    } else {
      alert('Sharing is not supported on this browser, but we appreciate your enthusiasm! Here\'s the message to share:\n\n' + message);
    }
  }

  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle("dark");
    toggleIndicator.style.transform = isDarkMode ? 'translateX(6px)' : 'translateX(0px)';
    themeToggle.style.backgroundColor = isDarkMode ? 'rgb(37 99 235)' : 'rgb(156 163 175)';
  }

  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});
