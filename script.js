let snake = [{ x: 10, y: 8 }];
let food = { x: 15, y: 15 };
let direction = { x: 1, y: 0 };
let gameSpeed = 200; // Easy Mode Speed
let stage = 1;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Retrieve high score from local storage
let gameInterval;

document.getElementById('highScore').innerText = `High Score: ${highScore}`; // Display the high score

document.getElementById('themeSelector').addEventListener('change', (e) => {
    document.body.className = e.target.value + '-theme';
});

document.getElementById('levelSelector').addEventListener('change', (e) => {
    const level = parseInt(e.target.value);
    switch (level) {
        case 1: gameSpeed = 150; break; // Easy
        case 2: gameSpeed = 120; break; // Normal
        case 3: gameSpeed = 100; break;  // Hard
    }
});

function startGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 1, y: 0 };
    stage = 1;
    score = 0;
    updateScoreDisplay();
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function gameLoop() {
    updateSnake();
    if (checkCollision()) return gameOver('Oops, It\'s paining I Want Rest Play Again!');
    drawGame();
    if (checkFoodEaten()) {
        score += 5;
        updateScoreDisplay();
        playSound('eat.mp3'); // Eating sound
        if (score >= 100 * stage) nextStage();
    }
}

function updateSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const [head, ...body] = snake;
    return body.some(segment => segment.x === head.x && segment.y === head.y) ||
        head.x < 0 || head.x >= 40 || head.y < 0 || head.y >= 25;
}

function drawGame() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x * 20}px`;
        snakeElement.style.top = `${segment.y * 20}px`;
        snakeElement.classList.add('snake-body');
        gameContainer.appendChild(snakeElement);
    });
    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x * 20}px`;
    foodElement.style.top = `${food.y * 20}px`;
    foodElement.classList.add('food');
    gameContainer.appendChild(foodElement);
}

function checkFoodEaten() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snake.push({}); // Grow the snake
        food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        return true;
    }
    return false;
}

function nextStage() {
    if (stage < 10) {
        stage++;
        alert('Next Stage Unlocked!');
    } else {
        gameOver('Hurry, You Did It!');
    }
}

function gameOver() {
    clearInterval(gameInterval);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Update high score in local storage
        document.getElementById('highScore').innerText = `High Score: ${highScore}`;
        alert('New High Score!');
    }
    // $('#gameOverModal').modal('show');
    else{
   msg = confirm("Oops, It\'s paining I Want Rest Play Again!")
   if (msg == true) {
    startGame()
    }
    else {
        window.location.reload();
    }
}
}


function updateScoreDisplay() {
    document.getElementById('currentScore').innerText = `Score: ${score}`;
}

function playSound(src) {
    const audio = new Audio(src);
    audio.play();
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (direction.x === 0) direction = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (direction.x === 0) direction = { x: 1, y: 0 }; break;
    }
});

