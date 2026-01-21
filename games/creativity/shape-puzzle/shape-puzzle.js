// Shape Puzzle Game Logic
let currentPuzzle = null;
let puzzleScore = 0;
let puzzleLevel = 1;
let currentCategory = 'animals';
let placedPieces = 0;
let totalPieces = 0;
let gameStarted = false;

// Object categories with their emojis and names
const puzzleObjects = {
  animals: [
    { emoji: '🐱', name: 'cat', pieces: ['🐱', '🐾', '👀', '🥛'] },
    { emoji: '🐶', name: 'dog', pieces: ['🐶', '🦴', '👃', '🐾'] },
    { emoji: '🐸', name: 'frog', pieces: ['🐸', '👀', '💚', '🪷'] },
    { emoji: '🦋', name: 'butterfly', pieces: ['🦋', '🌸', '💙', '✨'] },
    { emoji: '🐘', name: 'elephant', pieces: ['🐘', '👂', '💧', '🌿'] },
    { emoji: '🦁', name: 'lion', pieces: ['🦁', '👑', '💛', '🌅'] }
  ],
  food: [
    { emoji: '🍎', name: 'apple', pieces: ['🍎', '🌿', '❤️', '🍯'] },
    { emoji: '🍌', name: 'banana', pieces: ['🍌', '💛', '🌴', '☀️'] },
    { emoji: '🍕', name: 'pizza', pieces: ['🍕', '🧀', '🍅', '🌿'] },
    { emoji: '🎂', name: 'cake', pieces: ['🎂', '🕯️', '🎉', '💖'] },
    { emoji: '🍪', name: 'cookie', pieces: ['🍪', '🍫', '🥛', '😋'] },
    { emoji: '🍓', name: 'strawberry', pieces: ['🍓', '💚', '❤️', '🌸'] }
  ],
  furniture: [
    { emoji: '🪑', name: 'chair', pieces: ['🪑', '🪵', '⚫', '💺'] },
    { emoji: '🛏️', name: 'bed', pieces: ['🛏️', '😴', '🌙', '💤'] },
    { emoji: '🚪', name: 'door', pieces: ['🚪', '🔑', '🚪', '🏠'] },
    { emoji: '🪟', name: 'window', pieces: ['🪟', '☀️', '🌤️', '🏠'] },
    { emoji: '🛋️', name: 'sofa', pieces: ['🛋️', '🛏️', '📺', '🏠'] },
    { emoji: '📺', name: 'television', pieces: ['📺', '🔌', '📺', '🎬'] }
  ],
  toys: [
    { emoji: '🧸', name: 'teddy bear', pieces: ['🧸', '❤️', '🤗', '💤'] },
    { emoji: '⚽', name: 'ball', pieces: ['⚽', '🏃', '⚽', '🎯'] },
    { emoji: '🚗', name: 'toy car', pieces: ['🚗', '🛣️', '⛽', '🏁'] },
    { emoji: '🪀', name: 'yo-yo', pieces: ['🪀', '🌈', '🎯', '🤹'] },
    { emoji: '🎯', name: 'target', pieces: ['🎯', '🏹', '🎯', '🏆'] },
    { emoji: '🎲', name: 'dice', pieces: ['🎲', '⚫', '⚪', '🎮'] }
  ],
  vehicles: [
    { emoji: '🚗', name: 'car', pieces: ['🚗', '🛣️', '⛽', '🚗'] },
    { emoji: '✈️', name: 'airplane', pieces: ['✈️', '☁️', '🌍', '✈️'] },
    { emoji: '🚲', name: 'bicycle', pieces: ['🚲', '🚴', '🛣️', '🚲'] },
    { emoji: '🚂', name: 'train', pieces: ['🚂', '🛤️', '💨', '🚃'] },
    { emoji: '🚢', name: 'ship', pieces: ['🚢', '🌊', '⚓', '🚢'] },
    { emoji: '🚁', name: 'helicopter', pieces: ['🚁', '☁️', '🌪️', '🚁'] }
  ]
};

// Navigation function
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#creativity-section';
}

// Get random object from current category
function getRandomObject() {
  const objects = puzzleObjects[currentCategory];
  return objects[Math.floor(Math.random() * objects.length)];
}

// Show object preview and speak name
function showObjectPreview() {
  currentPuzzle = getRandomObject();
  const previewObject = document.getElementById('preview-object');
  const objectName = document.getElementById('object-name');
  
  if (previewObject && objectName) {
    previewObject.textContent = currentPuzzle.emoji;
    objectName.textContent = currentPuzzle.name;
    
    // Speak the object name
    speakText(`This is a ${currentPuzzle.name}. Look carefully and remember it!`);
  }
  
  // Update total pieces
  totalPieces = currentPuzzle.pieces.length;
  updatePiecesDisplay();
}

// Start the puzzle
function startPuzzle() {
  if (!currentPuzzle) {
    showObjectPreview();
    return;
  }
  
  gameStarted = true;
  placedPieces = 0;
  
  // Hide preview and show game area
  const preview = document.getElementById('object-preview');
  const gameArea = document.getElementById('game-area');
  const startBtn = document.getElementById('start-puzzle');
  const newBtn = document.getElementById('new-puzzle');
  
  if (preview) preview.style.display = 'none';
  if (gameArea) gameArea.style.display = 'block';
  if (startBtn) startBtn.style.display = 'none';
  if (newBtn) newBtn.style.display = 'inline-block';
  
  // Set up assembly grid based on number of pieces
  setupAssemblyGrid();
  
  // Create puzzle pieces
  createPuzzlePieces();
  
  // Update instructions
  const instructionText = document.getElementById('instruction-text');
  if (instructionText) {
    instructionText.textContent = `Drag the pieces to rebuild the ${currentPuzzle.name}!`;
  }
  
  updatePiecesDisplay();
  speakText(`Now drag the pieces to rebuild the ${currentPuzzle.name}!`);
}

// Setup assembly grid
function setupAssemblyGrid() {
  const grid = document.getElementById('assembly-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Determine grid size based on number of pieces
  const numPieces = currentPuzzle.pieces.length;
  const gridClass = numPieces <= 4 ? 'grid-2x2' : 'grid-3x3';
  grid.className = `assembly-grid ${gridClass}`;
  
  // Create slots
  const slotsNeeded = numPieces;
  for (let i = 0; i < slotsNeeded; i++) {
    const slot = document.createElement('div');
    slot.className = 'assembly-slot';
    slot.dataset.slotIndex = i;
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('drop', handleDrop);
    grid.appendChild(slot);
  }
}

// Create puzzle pieces
function createPuzzlePieces() {
  const piecesContainer = document.getElementById('puzzle-pieces');
  if (!piecesContainer) return;
  
  piecesContainer.innerHTML = '';
  
  // Shuffle pieces
  const shuffledPieces = [...currentPuzzle.pieces].sort(() => Math.random() - 0.5);
  
  shuffledPieces.forEach((piece, index) => {
    const pieceElement = document.createElement('div');
    pieceElement.className = 'puzzle-piece';
    pieceElement.textContent = piece;
    pieceElement.draggable = true;
    pieceElement.dataset.pieceIndex = currentPuzzle.pieces.indexOf(piece);
    pieceElement.dataset.originalIndex = index;
    
    pieceElement.addEventListener('dragstart', handleDragStart);
    pieceElement.addEventListener('dragend', handleDragEnd);
    
    piecesContainer.appendChild(pieceElement);
  });
}

// Drag and drop handlers
function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.pieceIndex);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
  e.target.classList.add('valid-drop');
}

function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove('valid-drop');
  
  const pieceIndex = parseInt(e.dataTransfer.getData('text/plain'));
  const slotIndex = parseInt(e.target.dataset.slotIndex);
  
  // Check if correct piece for this slot
  if (pieceIndex === slotIndex && !e.target.classList.contains('filled')) {
    // Correct placement
    const piece = currentPuzzle.pieces[pieceIndex];
    e.target.textContent = piece;
    e.target.classList.add('filled');
    e.target.classList.add('piece-snap');
    
    // Mark original piece as placed
    const originalPiece = document.querySelector(`[data-piece-index="${pieceIndex}"]`);
    if (originalPiece) {
      originalPiece.classList.add('placed');
    }
    
    placedPieces++;
    updatePiecesDisplay();
    
    // Play success sound
    speakText('Great!');
    
    // Check if puzzle is complete
    if (placedPieces === totalPieces) {
      completePuzzle();
    }
  } else {
    // Wrong placement
    speakText('Try a different spot!');
  }
}

// Complete puzzle
function completePuzzle() {
  puzzleScore += 20;
  const scoreElement = document.getElementById('puzzle-score');
  if (scoreElement) scoreElement.textContent = puzzleScore;
  
  // Level up every 100 points
  if (puzzleScore % 100 === 0) {
    puzzleLevel++;
    const levelElement = document.getElementById('puzzle-level');
    if (levelElement) levelElement.textContent = puzzleLevel;
  }
  
  // Show success message
  const successMessage = document.getElementById('success-message');
  const successText = document.getElementById('success-text');
  if (successMessage && successText) {
    successText.textContent = `Perfect! You rebuilt the ${currentPuzzle.name}!`;
    successMessage.style.display = 'block';
  }
  
  speakText(`Amazing! You perfectly rebuilt the ${currentPuzzle.name}! Great job!`);
  
  // Auto-start new puzzle after delay
  setTimeout(() => {
    if (successMessage) successMessage.style.display = 'none';
    newPuzzle();
  }, 3000);
}

// Start new puzzle
function newPuzzle() {
  gameStarted = false;
  placedPieces = 0;
  
  // Reset UI
  const preview = document.getElementById('object-preview');
  const gameArea = document.getElementById('game-area');
  const startBtn = document.getElementById('start-puzzle');
  const newBtn = document.getElementById('new-puzzle');
  const instructionText = document.getElementById('instruction-text');
  
  if (preview) preview.style.display = 'block';
  if (gameArea) gameArea.style.display = 'none';
  if (startBtn) startBtn.style.display = 'inline-block';
  if (newBtn) newBtn.style.display = 'none';
  if (instructionText) {
    instructionText.textContent = 'Listen to the object name and put the pieces back together!';
  }
  
  showObjectPreview();
}

// Reset current puzzle
function resetPuzzle() {
  if (!gameStarted) return;
  
  placedPieces = 0;
  updatePiecesDisplay();
  
  // Clear assembly grid
  const slots = document.querySelectorAll('.assembly-slot');
  slots.forEach(slot => {
    slot.textContent = '';
    slot.classList.remove('filled', 'piece-snap');
  });
  
  // Reset pieces
  const pieces = document.querySelectorAll('.puzzle-piece');
  pieces.forEach(piece => {
    piece.classList.remove('placed');
  });
  
  speakText('Puzzle reset! Try again!');
}

// Show hint
function showHint() {
  if (!gameStarted) {
    speakText(`Choose a category and click start to begin!`);
    return;
  }
  
  // Find next empty slot
  const emptySlot = document.querySelector('.assembly-slot:not(.filled)');
  if (emptySlot) {
    const slotIndex = parseInt(emptySlot.dataset.slotIndex);
    const hintPiece = currentPuzzle.pieces[slotIndex];
    speakText(`Try placing the ${hintPiece} piece next!`);
    
    // Highlight the correct piece briefly
    const correctPiece = document.querySelector(`[data-piece-index="${slotIndex}"]`);
    if (correctPiece && !correctPiece.classList.contains('placed')) {
      correctPiece.style.animation = 'pieceSnap 0.5s ease-out';
      setTimeout(() => {
        correctPiece.style.animation = '';
      }, 500);
    }
  }
}

// Update pieces display
function updatePiecesDisplay() {
  const placedElement = document.getElementById('pieces-placed');
  const totalElement = document.getElementById('total-pieces');
  if (placedElement) placedElement.textContent = placedPieces;
  if (totalElement) totalElement.textContent = totalPieces;
}

// Hear object name
function hearObjectName() {
  if (currentPuzzle) {
    speakText(`This is a ${currentPuzzle.name}`);
  } else {
    speakText('Choose a category and click start to begin!');
  }
}

// Change category
function changeCategory(category) {
  currentCategory = category;
  
  // Update active category button
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-category="${category}"]`).classList.add('active');
  
  // Reset game if needed
  if (!gameStarted) {
    showObjectPreview();
  }
  
  speakText(`${category} category selected!`);
}

// Save progress to localStorage
function saveProgress() {
  const progressData = {
    score: puzzleScore,
    level: puzzleLevel,
    lastPlayed: new Date().toISOString()
  };
  localStorage.setItem('shapePuzzleProgress', JSON.stringify(progressData));
}

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('shapePuzzleProgress');
  if (saved) {
    try {
      const progressData = JSON.parse(saved);
      puzzleScore = progressData.score || 0;
      puzzleLevel = progressData.level || 1;
      
      // Update display
      const scoreElement = document.getElementById('puzzle-score');
      const levelElement = document.getElementById('puzzle-level');
      if (scoreElement) scoreElement.textContent = puzzleScore;
      if (levelElement) levelElement.textContent = puzzleLevel;
    } catch (e) {
      console.log('Could not load shape puzzle progress');
    }
  }
}

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  // Load saved progress
  loadProgress();
  
  // Set up event listeners
  document.getElementById('start-puzzle').addEventListener('click', startPuzzle);
  document.getElementById('new-puzzle').addEventListener('click', newPuzzle);
  document.getElementById('hint-btn').addEventListener('click', showHint);
  document.getElementById('reset-puzzle').addEventListener('click', resetPuzzle);
  document.getElementById('hear-object-name').addEventListener('click', hearObjectName);
  
  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      changeCategory(e.target.dataset.category);
    });
  });
  
  // Initialize first object
  showObjectPreview();
  
  // Save progress periodically
  setInterval(saveProgress, 10000);
  
  // Welcome message
  setTimeout(() => {
    speakText('Welcome to Shape Puzzle! Choose a category and click start to begin building puzzles!');
  }, 1000);
});

// Save progress when leaving the page
window.addEventListener('beforeunload', saveProgress);