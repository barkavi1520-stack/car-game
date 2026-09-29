
const player = document.getElementById("player");

const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");
const livesElement = document.getElementById("lives");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over");

const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");

const countdown = document.getElementById("countdown");
const finalScore = document.getElementById("final-score");

const leftButton = document.getElementById("left-btn");
const rightButton = document.getElementById("right-btn");
const pauseButton = document.getElementById("pause-btn");

const enemies = document.querySelectorAll(".enemy");
const coins = document.querySelectorAll(".coin");
const trees = document.querySelectorAll(".road-object");


/* =========================
   GAME STATE
========================= */

let playerPosition = 50;

let score = 0;

let lives = 3;

let speed = 2;

let running = false;

let paused = false;

let animationId = null;


/* =========================
   START GAME
========================= */

startButton.addEventListener("click", startGame);

restartButton.addEventListener("click", startGame);


function startGame() {

    startScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    playerPosition = 50;

    score = 0;

    lives = 3;

    speed = 2;

    running = false;

    paused = false;

    pauseButton.textContent = "⏸";

    player.style.left = "50%";

    updateHUD();

    resetObjects();

    countdownStart();

}


/* =========================
   COUNTDOWN
========================= */

function countdownStart() {

    let number = 3;

    countdown.textContent = number;

    const timer = setInterval(() => {

        number--;

        if (number > 0) {

            countdown.textContent = number;

        } else if (number === 0) {

            countdown.textContent = "GO!";

        } else {

            clearInterval(timer);

            countdown.textContent = "";

            running = true;

            gameLoop();

        }

    }, 700);

}


/* =========================
   RESET OBJECTS
========================= */

function resetObjects() {

    enemies[0].style.top = "-200px";
    enemies[0].style.left = "25%";

    enemies[1].style.top = "-600px";
    enemies[1].style.left = "60%";

    enemies[2].style.top = "-1000px";
    enemies[2].style.left = "43%";


    coins[0].style.top = "-300px";
    coins[0].style.left = "40%";

    coins[1].style.top = "-700px";
    coins[1].style.left = "62%";

    coins[2].style.top = "-1100px";
    coins[2].style.left = "25%";


    trees.forEach((tree, index) => {

        tree.style.top =
            (-200 - index * 300) + "px";

    });

}


/* =========================
   MOVE PLAYER
========================= */

function moveLeft() {

    if (!running || paused) {
        return;
    }

    playerPosition -= 6;

    playerPosition =
        Math.max(18, playerPosition);

    player.style.left =
        playerPosition + "%";

    player.style.transform =
        "translateX(-50%) rotate(-5deg)";

    setTimeout(() => {

        player.style.transform =
            "translateX(-50%)";

    }, 120);

}


function moveRight() {

    if (!running || paused) {
        return;
    }

    playerPosition += 6;

    playerPosition =
        Math.min(82, playerPosition);

    player.style.left =
        playerPosition + "%";

    player.style.transform =
        "translateX(-50%) rotate(5deg)";

    setTimeout(() => {

        player.style.transform =
            "translateX(-50%)";

    }, 120);

}


/* =========================
   KEYBOARD
========================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        moveLeft();

    }

    if (event.key === "ArrowRight") {

        event.preventDefault();

        moveRight();

    }

    if (event.key === " " && running) {

        event.preventDefault();

        togglePause();

    }

});


/* =========================
   MOBILE TOUCH
========================= */

leftButton.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    moveLeft();

});


rightButton.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    moveRight();

});


pauseButton.addEventListener("pointerdown", function(event) {

    event.preventDefault();

    togglePause();

});


/* =========================
   PAUSE
========================= */

function togglePause() {

    if (!running) {
        return;
    }

    paused = !paused;

    pauseButton.textContent =
        paused ? "▶" : "⏸";

}


/* =========================
   COLLISION
========================= */

function isColliding(first, second) {

    const a =
        first.getBoundingClientRect();

    const b =
        second.getBoundingClientRect();

    const padding = 12;

    return !(
        a.right - padding < b.left ||
        a.left + padding > b.right ||
        a.bottom - padding < b.top ||
        a.top + padding > b.bottom
    );

}


/* =========================
   ENEMY MOVEMENT
========================= */

function updateEnemies() {

    enemies.forEach((enemy) => {

        let top =
            parseFloat(enemy.style.top) || -200;

        top += speed;

        enemy.style.top =
            top + "px";


        /* COLLISION */

        if (isColliding(player, enemy)) {

            enemy.style.top = "-250px";

            lives--;

            updateHUD();

            player.style.transform =
                "translateX(-50%) rotate(8deg)";

            setTimeout(() => {

                player.style.transform =
                    "translateX(-50%)";

            }, 200);


            if (lives <= 0) {

                endGame();

            }

        }


        /* CAR PASSED */

        if (top > 750) {

            score += 10;

            scoreElement.textContent = score;

            resetEnemy(enemy);

        }

    });

}


/* =========================
   RESET ENEMY
========================= */

function resetEnemy(enemy) {

    enemy.style.top =
        -(180 + Math.random() * 500) + "px";


    const lanes = [
        24,
        42,
        60,
        75
    ];

    enemy.style.left =
        lanes[
            Math.floor(
                Math.random() * lanes.length
            )
        ] + "%";

}


/* =========================
   COINS
========================= */

function updateCoins() {

    coins.forEach((coin) => {

        let top =
            parseFloat(coin.style.top) || -300;

        top += speed * 0.95;

        coin.style.top =
            top + "px";


        if (isColliding(player, coin)) {

            score += 50;

            coin.style.top = "-500px";

            updateHUD();

        }


        if (top > 750) {

            coin.style.top =
                -(300 + Math.random() * 700)
                + "px";

        }

    });

}


/* =========================
   TREES
========================= */

function updateTrees() {

    trees.forEach((tree) => {

        let top =
            parseFloat(tree.style.top) || -200;

        top += speed * 1.3;

        tree.style.top =
            top + "px";


        if (top > 800) {

            tree.style.top =
                -(200 + Math.random() * 500)
                + "px";

        }

    });

}


/* =========================
   SPEED
========================= */

let frameCounter = 0;

function increaseSpeed() {

    frameCounter++;

    if (frameCounter % 600 === 0) {

        speed += 0.25;

        if (speed > 5) {

            speed = 5;

        }

    }

}


/* =========================
   HUD
========================= */

function updateHUD() {

    scoreElement.textContent =
        score;

    speedElement.textContent =
        Math.floor(speed * 45);

    livesElement.textContent =
        "❤️".repeat(Math.max(lives, 0));

}


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!running) {
        return;
    }


    if (!paused) {

        updateEnemies();

        updateCoins();

        updateTrees();

        increaseSpeed();

        updateHUD();

    }


    animationId =
        requestAnimationFrame(gameLoop);

}


/* =========================
   GAME OVER
========================= */

function endGame() {

    running = false;

    paused = false;

    cancelAnimationFrame(animationId);

    finalScore.textContent =
        score;

    gameOverScreen.classList.remove(
        "hidden"
    );

}


/* =========================
   INITIAL STATE
========================= */

updateHUD();
