const emojis = ['🐶','🐱','🐻','🐼','🐯','🦁','🐮','🐷'];
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let moves = 0;
let timer, seconds = 0;

const grid = document.getElementById('gameGrid');
const timeEl = document.getElementById('time');
const movesEl = document.getElementById('moves');
const restartBtn = document.getElementById('restartBtn');
const winOverlay = document.getElementById('winOverlay');
const overlayRestart = document.getElementById('overlayRestart');

restartBtn.addEventListener('click', startGame);
overlayRestart.addEventListener('click', startGame);

function startGame() {
  clearInterval(timer);
  seconds = moves = 0;
  timeEl.textContent = '0';
  movesEl.textContent = '0';
  lockBoard = false;
  firstCard = secondCard = null;
  winOverlay.classList.remove('show');

  cards = shuffle([...emojis, ...emojis]);
  renderGrid();

  timer = setInterval(() => { 
    seconds++; 
    timeEl.textContent = seconds; 
  }, 1000);
}

function renderGrid() {
  grid.innerHTML = '';
  cards.forEach((emoji, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = idx;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
      </div>`;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card === firstCard) return;

  card.classList.add('flipped');
  if (!firstCard) {
    firstCard = card;
    return;
  }
  
  secondCard = card;
  movesEl.textContent = ++moves;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.querySelector('.card-back').textContent ===
                  secondCard.querySelector('.card-back').textContent;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');
  resetBoard();
  if (document.querySelectorAll('.matched').length === cards.length) {
    clearInterval(timer);
    setTimeout(() => winOverlay.classList.add('show'), 500);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the first game immediately
startGame();
