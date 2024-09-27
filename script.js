let level = 1;
let score = 0;
let gridSize = 2;
let rounds = 5;
let roundCount = 0;
let variation = 6;
let correctTile = null;
let tiles = [];
let gameInProgress = false;

const levelNumber = document.getElementById('level-number');
const scoreNumber = document.getElementById('score-number');
const gridContainer = document.querySelector('.grid-container');
const startButton = document.querySelector('.start-button');
const gameOverScreen = document.querySelector('.game-over');
const gameOverMessage = document.getElementById('game-over-message');

function startGame() {
    startButton.style.display = 'none';
    gameInProgress = true;
    roundCount = 0;
    generateGrid();
}

function generateGrid() {
    if (roundCount >= rounds) {
        level++;
        if (level <= 3) {
            gridSize = level + 1; // 2x2 for level 1, 3x3 for level 2, etc.
            rounds = 5;
        } else {
            rounds = 7 + (level - 4) * 2; // Increase rounds from level 4
        }
        roundCount = 0;
    }

    gridContainer.innerHTML = '';
    roundCount++;

    const baseColor = getRandomColor();
    correctTile = Math.floor(Math.random() * gridSize * gridSize);
    tiles = Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (index === correctTile) {
            tile.style.backgroundColor = adjustColor(baseColor, variation);
        } else {
            tile.style.backgroundColor = baseColor;
        }
        tile.addEventListener('click', () => onTileClick(index));
        gridContainer.appendChild(tile);
        return tile;
    });

    updateLevelAndScore();
}

function onTileClick(index) {
    if (!gameInProgress) return;

    if (index === correctTile) {
        score += 1;
        animateCorrectTile(tiles[index]);
        setTimeout(generateGrid, 500); // Wait before generating new grid
    } else {
        gameOver();
    }
}

function animateCorrectTile(tile) {
    tile.classList.add('correct');
    setTimeout(() => {
        tile.classList.remove('correct');
    }, 300);
}

function updateLevelAndScore() {
    levelNumber.textContent = level;
    scoreNumber.textContent = score;
}

function getRandomColor() {
    const r = Math.floor(Math.random() * 200) + 56; // Random RGB values
    const g = Math.floor(Math.random() * 200) + 56;
    const b = Math.floor(Math.random() * 200) + 56;
    return `rgb(${r}, ${g}, ${b})`;
}

function adjustColor(color, variation) {
    const rgb = color.match(/\d+/g);
    return `rgb(${Math.max(0, rgb[0] - variation)}, ${Math.max(0, rgb[1] - variation)}, ${Math.max(0, rgb[2] - variation)})`; // Ensure RGB values stay within bounds
}

function gameOver() {
    gameInProgress = false;
    alert("😣 Uh-huh! Try relaxing your eyes for 10 minutes! 😌");
    displayGameOverMessage();
    gameOverScreen.classList.add('active');
}

function displayGameOverMessage() {
    const messages = [
        "🔍 You're so close! Try again and beat your high score! 🎯",
        "💪 Just missed it! You’ve got what it takes, try again! 🔁",
        "🏃‍♂️ Almost there! A few more tries and victory is yours! 🏆",
        "🔥 Don’t stop now! The next level is waiting for you! 🚀",
        "👏 Great effort! Keep going, the next challenge awaits you! 🎮",
        "🌟 You’ve mastered this far, now push through to the top! 🔝",
        "⚡ Your progress is amazing! Restart and climb even higher! ⏫",
        "💥 Unstoppable! Try again, and conquer the toughest levels yet! 🗻",
        "🎯 Challenge accepted? Keep playing and dominate the leaderboard! 🏅",
        "🏁 Almost there! One more round and you’ll break through! 🥇"
    ];
    let messageIndex = Math.floor(score / 15);
    if (score === 150) {
        gameOverMessage.textContent = "🎉 Woo-hoo! Congratulations! You have eagle eyes! 🦅 Share your achievement and invite friends to test their skills too! 📣";
    } else {
        gameOverMessage.textContent = messages[messageIndex] || messages[messages.length - 1];
    }
}

function restartGame() {
    gameOverScreen.classList.remove('active');
    level = 1;
    score = 0;
    gameInProgress = true;
    generateGrid();
}

function shareGame() {
    const shareData = {
        title: 'Brainology 3.0',
        text: `I scored ${score} points on Brainology 3.0! Can you beat my score?`,
        url: window.location.href
    };
    navigator.share(shareData).catch(console.error);
}

function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
}
