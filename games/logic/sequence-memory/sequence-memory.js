// Image items (same as memory game)
const items = [
    { icon: "🍎", label: "apple" },
    { icon: "🚗", label: "car" },
    { icon: "⭐", label: "star" },
    { icon: "🐶", label: "dog" },
    { icon: "🌸", label: "flower" },
    { icon: "⚽", label: "ball" },
    { icon: "🏠", label: "house" },
    { icon: "🐱", label: "cat" }
];

// Game state
const gameState = {
    sequence: [],
    playerSequence: [],
    level: 1,
    score: 0,
    isPlayingSequence: false,
    gameStarted: false,
    stage: 'easy', // easy, medium, hard
    numberOfCards: 4,
    currentItems: []
};

// Stage configurations
const stageConfig = {
    easy: {
        name: 'Easy',
        startCards: 4,
        maxCards: 6,
        startSequence: 2,
        memorizeTimeBase: 4000,
        memorizeTimePerItem: 1200
    },
    medium: {
        name: 'Medium',
        startCards: 6,
        maxCards: 8,
        startSequence: 3,
        memorizeTimeBase: 3500,
        memorizeTimePerItem: 1000
    },
    hard: {
        name: 'Hard',
        startCards: 8,
        maxCards: 8,
        startSequence: 4,
        memorizeTimeBase: 3000,
        memorizeTimePerItem: 800
    }
};

// Initialize the game
function initGame() {
    createMemoryCards();
    updateStats();
}

// Select stage
function selectStage(stage) {
    if (gameState.gameStarted) {
        if (!confirm('Starting a new stage will reset your progress. Continue?')) {
            return;
        }
    }
    
    gameState.stage = stage;
    gameState.level = 1;
    gameState.score = 0;
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.gameStarted = false;
    gameState.numberOfCards = stageConfig[stage].startCards;
    
    // Update stage buttons
    document.querySelectorAll('.stage-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${stage}Btn`).classList.add('active');
    
    createMemoryCards();
    updateStats();
    clearSequenceDisplay();
    document.getElementById('yourSequenceDisplay').innerHTML = '<p>Click the cards in the same order...</p>';
    document.getElementById('message').textContent = `${stageConfig[stage].name} Stage - Click "Start Game"!`;
    document.getElementById('startBtn').disabled = false;
}

// Create memory cards with images and flip structure
function createMemoryCards() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    
    // Select random items
    gameState.currentItems = items.slice(0, gameState.numberOfCards);
    
    for (let i = 0; i < gameState.numberOfCards; i++) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.dataset.icon = gameState.currentItems[i].icon;
        card.dataset.label = gameState.currentItems[i].label;
        
        // Create flip structure
        const inner = document.createElement('div');
        inner.className = 'card-inner';
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.textContent = '?';
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.textContent = gameState.currentItems[i].icon;
        
        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        
        card.onclick = () => cardClicked(i);
        grid.appendChild(card);
    }
}

// Start the game
function startGame() {
    if (gameState.isPlayingSequence || gameState.gameStarted) return;
    
    gameState.gameStarted = true;
    gameState.playerSequence = [];
    gameState.sequence = [];
    
    // Generate sequence based on stage
    const config = stageConfig[gameState.stage];
    const sequenceLength = config.startSequence + (gameState.level - 1);
    
    for (let i = 0; i < sequenceLength; i++) {
        const randomIndex = Math.floor(Math.random() * gameState.numberOfCards);
        gameState.sequence.push(randomIndex);
    }
    
    // Play the sequence
    playSequence();
    
    // Disable start button during sequence
    document.getElementById('startBtn').disabled = true;
}

// Play the sequence
async function playSequence() {
    gameState.isPlayingSequence = true;
    disableAllCards(true);
    
    document.getElementById('message').textContent = 'Look at all the cards! Memorize them...';
    clearSequenceDisplay();
    
    // Flip all cards open to show images
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => card.classList.add('flipped'));
    
    // Build the sequence display
    const displayDiv = document.getElementById('sequenceDisplay');
    gameState.sequence.forEach((index) => {
        const item = document.createElement('div');
        item.className = 'sequence-item';
        item.textContent = gameState.currentItems[index].icon;
        displayDiv.appendChild(item);
    });
    
    // Wait for child to memorize (based on stage difficulty)
    const config = stageConfig[gameState.stage];
    const memorizeTime = config.memorizeTimeBase + (gameState.sequence.length * config.memorizeTimePerItem);
    await delay(memorizeTime);
    
    // Flip all cards back closed
    document.getElementById('message').textContent = 'Cards are closing...';
    await delay(500);
    allCards.forEach(card => card.classList.remove('flipped'));
    
    await delay(800);
    
    gameState.isPlayingSequence = false;
    disableAllCards(false);
    
    document.getElementById('message').textContent = `Your turn! Click ${gameState.sequence.length} card(s) in the correct order`;
}

// Update sequence display
function updateSequenceDisplay() {
    const displayDiv = document.getElementById('sequenceDisplay');
    displayDiv.innerHTML = '';
    
    gameState.sequence.forEach((index) => {
        const item = document.createElement('div');
        item.className = 'sequence-item';
        item.textContent = gameState.currentItems[index].icon;
        item.style.opacity = '0.6';
        displayDiv.appendChild(item);
    });
}

// Clear sequence display
function clearSequenceDisplay() {
    const displayDiv = document.getElementById('sequenceDisplay');
    displayDiv.innerHTML = '';
}

// Update player sequence display
function updatePlayerSequenceDisplay() {
    const displayDiv = document.getElementById('yourSequenceDisplay');
    displayDiv.innerHTML = '';
    
    if (gameState.playerSequence.length === 0) {
        displayDiv.innerHTML = '<p>Click the cards in the same order...</p>';
        return;
    }
    
    gameState.playerSequence.forEach((index) => {
        const item = document.createElement('div');
        item.className = 'your-item';
        item.textContent = gameState.currentItems[index].icon;
        displayDiv.appendChild(item);
    });
}

// Card clicked
async function cardClicked(index) {
    if (gameState.isPlayingSequence || !gameState.gameStarted) return;
    
    // Don't allow clicking already flipped cards during player turn
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped')) return;
    
    gameState.playerSequence.push(index);
    
    // Flip the card
    card.classList.add('flipped');
    playSound();
    
    // Update player display
    updatePlayerSequenceDisplay();
    
    await delay(600);
    
    // Check if the click is correct
    if (gameState.playerSequence[gameState.playerSequence.length - 1] !== gameState.sequence[gameState.playerSequence.length - 1]) {
        // Wrong click
        playErrorSound();
        await delay(500);
        
        document.getElementById('message').textContent = '❌ Wrong! Game Over!';
        disableAllCards(true);
        resetGameAfterDelay();
        return;
    }
    
    // Correct click
    playCorrectSound();
    
    // Check if player completed the sequence
    if (gameState.playerSequence.length === gameState.sequence.length) {
        gameState.score += gameState.level * 10;
        updateStats();
        
        document.getElementById('message').textContent = '✅ Correct! Next level...';
        disableAllCards(true);
        
        await delay(1500);
        
        // Increase difficulty
        gameState.level++;
        gameState.playerSequence = [];
        
        // Increase cards based on stage and level
        const config = stageConfig[gameState.stage];
        if (gameState.level % 2 === 0 && gameState.numberOfCards < config.maxCards) {
            gameState.numberOfCards++;
        }
        
        createMemoryCards();
        playSequence();
        document.getElementById('startBtn').disabled = true;
    }
}

// Disable/enable all cards
function disableAllCards(disabled) {
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        if (disabled) {
            card.classList.add('disabled');
        } else {
            card.classList.remove('disabled');
        }
    });
}

// Update stats display
function updateStats() {
    document.getElementById('stage').textContent = stageConfig[gameState.stage].name;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('sequenceCount').textContent = gameState.sequence.length;
}

// Reset game
function resetGame() {
    const currentStage = gameState.stage;
    gameState.sequence = [];
    gameState.playerSequence = [];
    gameState.level = 1;
    gameState.score = 0;
    gameState.isPlayingSequence = false;
    gameState.gameStarted = false;
    gameState.numberOfCards = stageConfig[currentStage].startCards;
    
    createMemoryCards();
    updateStats();
    clearSequenceDisplay();
    document.getElementById('yourSequenceDisplay').innerHTML = '<p>Click the cards in the same order...</p>';
    
    document.getElementById('message').textContent = 'Click "Start Game" - Cards will open, memorize them!';
    document.getElementById('startBtn').disabled = false;
}

// Reset game after delay
async function resetGameAfterDelay() {
    await delay(2000);
    resetGame();
}

// Utility function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Sound effects (using Web Audio API)
function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Audio context not available
    }
}

function playCorrectSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a pleasant beeping sound for correct
        for (let i = 0; i < 2; i++) {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = 600 + (i * 200);
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (i * 0.1);
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.1);
        }
    } catch (e) {
        // Audio context not available
    }
}

function playErrorSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Audio context not available
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initGame);
