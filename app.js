// Store and update the score.
// We will use an object to store values.
const score = JSON.parse(localStorage.getItem('savedScore')) ?? 
                {
                wins : 0,
                losses : 0, 
                ties : 0
                };
// Display score on front end.
updateScoreElement();

let playerMoveEmoji;
let computerMoveEmoji;
// Function for game.
function playGame(playerMove) {
    if (score.wins >= 5 || score.losses >= 5) {
        openEndgameModal()
        return
      }

    const clickSound = document.getElementById('clickSound');
    clickSound.play();

    const computerMove = pickComputerMove();

    let result = '';

    if (playerMove === 'scissors') {
        playerMoveEmoji = "✌";
        if (computerMove === 'rock') {
        result = 'You lose!';
        } else if (computerMove === 'paper') {
        result = 'You win!';
        } else if (computerMove === 'scissors') {
        result = 'Tie.';
        }

    } else if (playerMove === 'paper') {
        playerMoveEmoji = "✋";
        if (computerMove === 'rock') {
        result = 'You win!';
        } else if (computerMove === 'paper') {
        result = 'Tie.';
        } else if (computerMove === 'scissors') {
        result = 'You lose!';
        }
        
    } else if (playerMove === 'rock') {
        playerMoveEmoji = "✊";
        if (computerMove === 'rock') {
        result = 'Tie.';
        } else if (computerMove === 'paper') {
        result = 'You lose!';
        } else if (computerMove === 'scissors') {
        result = 'You win!';
        }
    }
    // Update the score object based on match.
    if(result === 'You win!') score.wins += 1;
    else if(result === 'You lose!') score.losses += 1;
    else score.ties += 1;

    localStorage.setItem('savedScore', JSON.stringify(score));

    updateScoreElement();
    document.querySelector('.js-result')
        .innerHTML = `${result}`;
    document.querySelector('.js-moves')
        .innerHTML = `You picked <span class="winner-emoji">${playerMoveEmoji}</span>, Computer picked <span class="winner-emoji">${computerMoveEmoji}</span>`;

    if (score.wins >= 5 || score.losses >= 5) {
        openEndgameModal()
        setFinalMessage()
        return
        }
    }

// Update score element
function updateScoreElement() {
    document.querySelector('#win-score')
        .innerHTML = `${score.wins}`;
    document.querySelector('#lose-score')
        .innerHTML = `${score.losses}`;
    document.querySelector('#tie-score')
        .innerHTML = `${score.ties}`;
    }

// Function for Computer Move
function pickComputerMove() {
    const randomNumber = Math.floor(Math.random()*3);
    let computerMove = '';

    if (randomNumber === 0) {
    computerMove = 'rock';
    computerMoveEmoji = "✊";
    } else if (randomNumber === 1) {
    computerMove = 'paper';
    computerMoveEmoji = "✋";
    } else if (randomNumber === 2) {
    computerMove = 'scissors';
    computerMoveEmoji = "✌";
    }
    return computerMove;
}
function resetScore() {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;

    document.querySelector('#win-score')
        .innerHTML = `❔`;
    document.querySelector('#lose-score')
        .innerHTML = `❔`;
    document.querySelector('#tie-score')
        .innerHTML = `❔`;

    document.querySelector('.js-result')
        .innerHTML = `Choose your weapon`;
    document.querySelector('.js-moves')
        .innerHTML = `First to score 5 points wins the game.`;

    if (isAutoPlaying) {
        clearInterval(intervalId);
        isAutoPlaying = false;
        autoPlayBtn.innerHTML = 'Auto Play';
        autoPlayBtn.classList.remove('active');
    }
    
    endgameModal.classList.remove('active');
    overlay.classList.remove('active');
        
    localStorage.removeItem('savedScore');
}

// Modal Feature
const endgameModal = document.getElementById('endgameModal');
const endgameMsg = document.getElementById('endgameMsg');
const overlay = document.getElementById('overlay');
const happySound = document.getElementById('happySound');
const sadSound = document.getElementById('sadSound');

overlay.addEventListener('click', closeEndgameModal);

function openEndgameModal() {
    endgameModal.classList.add('active');
    overlay.classList.add('active');
  }
  
function closeEndgameModal() {
    endgameModal.classList.remove('active');
    overlay.classList.remove('active');
}

function setFinalMessage() {
    if(score.wins > score.losses) {
        endgameMsg.textContent = 'You won!😼';
        happySound.play();
    }
    else {
        endgameMsg.textContent = 'You lost.😿';
        sadSound.play();
    }
}

// Auto Play Feature
let isAutoPlaying = false;
let intervalId;
const autoPlayBtn = document.querySelector('#autoPlayBtn');

function autoPlay() {
    if(!isAutoPlaying) {
        intervalId = setInterval(()=>{
            const playerMove = pickComputerMove();
            playGame(playerMove);
            clickEffect(playerMove);
        }, 700);
        isAutoPlaying = true;
        autoPlayBtn.classList.add('active');
        autoPlayBtn.addEventListener('mouseover', handleHover);
        autoPlayBtn.addEventListener('mouseout', handleHover);
    } else {
        clearInterval(intervalId);
        isAutoPlaying = false;
        autoPlayBtn.innerHTML = 'Auto Play';
        autoPlayBtn.classList.remove('active');
    }
}
function clickEffect(playerMove) {
    const moveId = `${playerMove}Btn`;
    const button = document.getElementById(moveId);
    button.classList.add('active');
  
    setTimeout(() => {
        button.classList.remove('active');
    }, 500); // Revert back to normal after 500 milliseconds
}
function handleHover(event) {
    if (isAutoPlaying) {
        if (event.type === 'mouseover') {
            autoPlayBtn.innerHTML = 'Stop';
        } else if (event.type === 'mouseout') {
            autoPlayBtn.innerHTML = 'Playing...';
        }
    }
}
