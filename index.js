let hand1Top = 50;
let hand2Top = 50;
let BallTop = 50;
let BallLeft = 50;
const activeKeys = {};
let nextXStep = 1;
let nextYStep = 0;
let score1 = 0;
let score2 = 0;
let isRunning = false;
let vsComputer = true;
let hand1;
let hand2 ;
let ball ;
let scoreP1;
let scoreP2;
let gameOver;
let HomeScreen;

let scoreA = new Audio('sound3.wav');

onload =  function() {

     hand1 = document.getElementById('Hand1');
     hand2 = document.getElementById('Hand2');
     ball = document.getElementById('ball');
     scoreP1 = document.getElementById('scorePlayer1');
     scoreP2 = document.getElementById('scorePlayer2');
     gameOver = document.getElementById('GameOver');
     HomeScreen = document.getElementById('HomeScreen');

}

let animationFrameId;

// Track key states
onkeydown = (e) => {
    activeKeys[e.key] = true;
    if (!animationFrameId) {
        startAnimationLoop();
    }
};
onkeyup = function (e) {
    activeKeys[e.key] = false; // Mark the key as inactive
};

function startAnimationLoop() {
    function update() {
        let hasMovement = false;

        // Handle hand1 movement
        if (activeKeys['w'] || activeKeys['W'] || (vsComputer && activeKeys['ArrowUp'])) {
            if (hand1Top > 14) {
                hand1Top -= 1.5;
                hand1.style.top = `${hand1Top}%`;
                hasMovement = true;
            }
        }
        if (activeKeys['s'] || activeKeys['S'] || (vsComputer && activeKeys['ArrowDown'])) {
            if (hand1Top < 86) {
                hand1Top += 1.5;
                hand1.style.top = `${hand1Top}%`;
                hasMovement = true;
            }
        }

        // Handle hand2 movement
        if (activeKeys['ArrowUp'] && !vsComputer) {
            if (hand2Top > 14) {
                hand2Top -= 1.5;
                hand2.style.top = `${hand2Top}%`;
                hasMovement = true;
            }
        }
        if (activeKeys['ArrowDown'] && !vsComputer) {
            if (hand2Top < 86) {
                hand2Top += 1.5;
                hand2.style.top = `${hand2Top}%`;
                hasMovement = true;
            }
        }
        // Continue the loop if any movement occurred
        if (hasMovement) {
            animationFrameId = requestAnimationFrame(update);
        } else {
            animationFrameId = null;
        }
    }

    // Start the loop
    animationFrameId = requestAnimationFrame(update);
}

function pongPong() {
    let pong = new Audio('./pingpongBounce.mp3');

    pong.currentTime = 0.36; // Reset to start

    pong.play().catch(() => {
        console.warn('Error playing')
    });
    // Stop sound after 1 second
    setTimeout(() => {
        pong.pause(); // Pause playback

    }, 400); // 1000ms = 1 second
}
async function MoveBall(){
    if (!isRunning) {
        return;
    }
    BallLeft += nextXStep;
    BallTop += nextYStep;
    ball.style.left = `${BallLeft}%`;
    ball.style.top = `${BallTop}%`;

    if (BallLeft <= 7 ) {
        let Dif = hand1Top - BallTop;
        if (Math.abs(Dif) <= 11){
            nextXStep = -nextXStep;
            nextYStep += Dif/22;
            pongPong()

        }

    }
    else if (BallLeft >= 93) {
        let Dif = hand2Top - BallTop;
        if (Math.abs(Dif) <= 11){
            nextYStep -= Dif/22;

            nextXStep = -Math.min(Math.abs(nextXStep), 1);
           pongPong()

        }
    }
    if (BallLeft <= 1 || BallLeft >= 99) {
        resetBall();
    }
    if (BallTop <= 2 || BallTop >= 98){
        nextYStep = -nextYStep;
        pongPong()
    }
    requestAnimationFrame(MoveBall);
}

function resetBall() {
    isRunning = false;
    if (BallLeft >= 99){
        nextXStep = 1;
        ++score1;
        scoreP1.innerText = score1 < 10? "0"+ String(score1): String(score1);
        scoreA.currentTime = 0;
        scoreA.play();
        if (score1 > 9){
            const gameOverDisplay = gameOver.querySelector('span');
            gameOverDisplay.innerText = "Player 01 Wins";
            gameOver.style.display = "block";
            return;
        }

    }
    else {
        ++score2;
        nextXStep = -1;
        scoreP2.innerText = score2 < 10? "0"+ String(score2): String(score2);

        scoreA.currentTime = 0;
        scoreA.play();
        if (score2 > 9){
            const gameOverDisplay = gameOver.querySelector('span');
            gameOverDisplay.innerText = "Player 02 Wins";
            gameOver.style.display = "block";
            return
        }
    }

    scoreA.currentTime = 0;
    scoreA.play().catch((err) => {
        alert('Error: ' + err.message)
    })

    BallLeft = 50;
    BallTop = 50;
    ball.style.left = `${BallLeft}%`;
    ball.style.top = `${BallTop}%`;
    nextYStep = 0;
    setTimeout(()=>{
        isRunning = true;
        requestAnimationFrame(MoveBall);
    },1500)
}




function replay() {

     hand1Top = hand2Top = BallTop = BallLeft = 50;
     nextXStep = 1;
     nextYStep = 0;
     score1 = 0;
     score2 = 0;
     isRunning = false;
     gameOver.style.display = 'none';

    MoveHand(hand1,50);
    MoveHand(hand2,50);
    MoveHand(ball,50);

    ball.style.left = `${BallLeft}%`;
    scoreP1.innerText = scoreP2.innerText = "00";






    setTimeout(()=>{
        isRunning = true;
        requestAnimationFrame(MoveBall);
    },1500)

    if (vsComputer){
        setTimeout(()=>{
            requestAnimationFrame(nextMove);
        },0)
    }

}

function MoveHand (hand,value){
    hand.style.top = `${value}%`;
}


function nextMove(){
    let a = 0;
    if (BallTop > hand2Top + 22 && hand2Top <= 86 && nextXStep > 0){
        a = 1;
    }
    else if (BallTop < hand2Top - 22 && hand2Top >= 14 && nextXStep > 0){
        a = -1;
    }
    else if (BallTop < hand2Top - 11 && hand2Top >= 14 && nextXStep > 0){
        a = -1.5;
    }
    else if (BallTop > hand2Top + 11 && hand2Top <= 86 && nextXStep > 0){
        a = 1.5;
    }
    hand2Top += a;
    MoveHand(hand2, hand2Top);
    if (vsComputer) {
        requestAnimationFrame(nextMove);
    }

}

function goHome() {
    HomeScreen.style.display = 'flex'
}

function play(vsBot) {
    vsComputer = vsBot;
    HomeScreen.style.display = 'none'
    replay()
}