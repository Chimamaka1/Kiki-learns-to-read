// Shape Puzzle Game Logic
let currentPuzzle = null;
let puzzleScore = 0;
let puzzleLevel = 1;
let currentCategory = 'animals';
let placedPieces = 0;
let totalPieces = 0;
let gameStarted = false;
let selectedPieceIndex = null;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Object categories with their emojis and names
const puzzleObjects = {
  animals: [
    { emoji: '🐱', name: 'cat', pieces: ['🐱', '🐾', '👀', '🥛'], image: '../../../assets/images/cat.png' },
    { emoji: '🐶', name: 'dog', pieces: ['🐶', '🦴', '👃', '🐾'], image: '../../../assets/images/dog.png' },
    { emoji: '🐸', name: 'frog', pieces: ['🐸', '👀', '💚', '🪷'], image: '../../../assets/images/fish.png' },
    { emoji: '🦋', name: 'butterfly', pieces: ['🦋', '🌸', '💙', '✨'], image: '../../../assets/images/bird.png' },
    { emoji: '🐘', name: 'elephant', pieces: ['🐘', '👂', '💧', '🌿'], image: '../../../assets/images/cat.png' },
    { emoji: '🦁', name: 'lion', pieces: ['🦁', '👑', '💛', '🌅'], image: '../../../assets/images/dog.png' }
  ],
  food: [
    { emoji: '🍎', name: 'apple', pieces: ['🍎', '🌿', '❤️', '🍯'], image: '../../../assets/images/apple.png' },
    { emoji: '🍌', name: 'banana', pieces: ['🍌', '💛', '🌴', '☀️'], image: '../../../assets/images/apple.png' },
    { emoji: '🍕', name: 'pizza', pieces: ['🍕', '🧀', '🍅', '🌿'], image: '../../../assets/images/apple.png' },
    { emoji: '🎂', name: 'cake', pieces: ['🎂', '🕯️', '🎉', '💖'], image: '../../../assets/images/apple.png' },
    { emoji: '🍪', name: 'cookie', pieces: ['🍪', '🍫', '🥛', '😋'], image: '../../../assets/images/apple.png' },
    { emoji: '🍓', name: 'strawberry', pieces: ['🍓', '💚', '❤️', '🌸'], image: '../../../assets/images/apple.png' }
  ],
  furniture: [
    { emoji: '🪑', name: 'chair', pieces: ['🪑', '🪵', '⚫', '💺'], image: '../../../assets/images/house.png' },
    { emoji: '🛏️', name: 'bed', pieces: ['🛏️', '😴', '🌙', '💤'], image: '../../../assets/images/bed.png' },
    { emoji: '🚪', name: 'door', pieces: ['🚪', '🔑', '🚪', '🏠'], image: '../../../assets/images/house.png' },
    { emoji: '🪟', name: 'window', pieces: ['🪟', '☀️', '🌤️', '🏠'], image: '../../../assets/images/house.png' },
    { emoji: '🛋️', name: 'sofa', pieces: ['🛋️', '🛏️', '📺', '🏠'], image: '../../../assets/images/bed.png' },
    { emoji: '📺', name: 'television', pieces: ['📺', '🔌', '📺', '🎬'], image: '../../../assets/images/house.png' }
  ],
  toys: [
    { emoji: '🧸', name: 'teddy bear', pieces: ['🧸', '❤️', '🤗', '💤'], image: '../../../assets/images/ball.png' },
    { emoji: '⚽', name: 'ball', pieces: ['⚽', '🏃', '⚽', '🎯'], image: '../../../assets/images/ball.png' },
    { emoji: '🚗', name: 'toy car', pieces: ['🚗', '🛣️', '⛽', '🏁'], image: '../../../assets/images/car.png' },
    { emoji: '🪀', name: 'yo-yo', pieces: ['🪀', '🌈', '🎯', '🤹'], image: '../../../assets/images/ball.png' },
    { emoji: '🎯', name: 'target', pieces: ['🎯', '🏹', '🎯', '🏆'], image: '../../../assets/images/star.png' },
    { emoji: '🎲', name: 'dice', pieces: ['🎲', '⚫', '⚪', '🎮'], image: '../../../assets/images/ball.png' }
  ],
  vehicles: [
    { emoji: '🚗', name: 'car', pieces: ['🚗', '🛣️', '⛽', '🚗'], image: '../../../assets/images/car.png' },
    { emoji: '✈️', name: 'airplane', pieces: ['✈️', '☁️', '🌍', '✈️'], image: '../../../assets/images/car.png' },
    { emoji: '🚲', name: 'bicycle', pieces: ['🚲', '🚴', '🛣️', '🚲'], image: '../../../assets/images/car.png' },
    { emoji: '🚂', name: 'train', pieces: ['🚂', '🛤️', '💨', '🚃'], image: '../../../assets/images/car.png' },
    { emoji: '🚢', name: 'ship', pieces: ['🚢', '🌊', '⚓', '🚢'], image: '../../../assets/images/car.png' },
    { emoji: '🚁', name: 'helicopter', pieces: ['🚁', '☁️', '🌪️', '🚁'], image: '../../../assets/images/car.png' }
  ]
};

// Jigsaw puzzle configurations
const jigsawConfig = {
  easy: { rows: 2, cols: 2, pieces: 4 },
  medium: { rows: 3, cols: 3, pieces: 9 },
  hard: { rows: 4, cols: 4, pieces: 16 }
};

let jigsawDifficulty = 'easy';

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
    // Show image preview
    previewObject.innerHTML = `<img src="${currentPuzzle.image}" alt="${currentPuzzle.name}" style="width: 100%; height: 100%; object-fit: contain;">`;
    objectName.textContent = currentPuzzle.name;
    speakText(`This is a ${currentPuzzle.name}. Look carefully and remember it!`);
  }
  
  // Update total pieces
  totalPieces = jigsawConfig[jigsawDifficulty].pieces;
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
  const referenceImage = document.getElementById('reference-image');
  
  if (preview) preview.style.display = 'none';
  if (gameArea) gameArea.style.display = 'block';
  if (startBtn) startBtn.style.display = 'none';
  if (newBtn) newBtn.style.display = 'inline-block';
  
  // Show reference image
  if (referenceImage) {
    referenceImage.style.display = 'block';
    referenceImage.innerHTML = `
      <h3>Reference Image:</h3>
      <div class="reference-container">
        <img src="${currentPuzzle.image}" alt="${currentPuzzle.name}" class="reference-img">
        <p class="reference-name">${currentPuzzle.name}</p>
      </div>
    `;
  }
  
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
  
  const config = jigsawConfig[jigsawDifficulty];
  grid.className = `assembly-grid jigsaw-grid`;
  grid.style.gridTemplateColumns = `repeat(${config.cols}, 100px)`;
  grid.style.gridTemplateRows = `repeat(${config.rows}, 100px)`;
  
  for (let i = 0; i < config.pieces; i++) {
    const slot = document.createElement('div');
    slot.className = 'assembly-slot jigsaw-slot';
    slot.dataset.slotIndex = i;
    slot.style.width = '100px';
    slot.style.height = '100px';
    slot.addEventListener('dragover', handleDragOver);
    slot.addEventListener('drop', handleDrop);
    slot.addEventListener('click', handleSlotSelect);
    slot.addEventListener('touchstart', handleSlotSelect);
    grid.appendChild(slot);
  }
}

// Create puzzle pieces
function createPuzzlePieces() {
  const piecesContainer = document.getElementById('puzzle-pieces');
  if (!piecesContainer) return;
  
  piecesContainer.innerHTML = '';
  createJigsawPieces();
}

// Create jigsaw puzzle pieces from image
function createJigsawPieces() {
  const piecesContainer = document.getElementById('puzzle-pieces');
  const config = jigsawConfig[jigsawDifficulty];
  const pieceWidth = 100;
  const pieceHeight = 100;
  
  // Create array of piece indices and shuffle
  const pieceIndices = Array.from({length: config.pieces}, (_, i) => i);
  const shuffledIndices = pieceIndices.sort(() => Math.random() - 0.5);
  
  shuffledIndices.forEach((pieceIndex) => {
    const row = Math.floor(pieceIndex / config.cols);
    const col = pieceIndex % config.cols;
    
    const pieceElement = document.createElement('div');
    pieceElement.className = 'puzzle-piece jigsaw-piece';
    pieceElement.draggable = true;
    pieceElement.dataset.pieceIndex = pieceIndex;
    pieceElement.style.width = `${pieceWidth}px`;
    pieceElement.style.height = `${pieceHeight}px`;
    pieceElement.style.position = 'relative';
    pieceElement.style.overflow = 'hidden';
    pieceElement.style.border = '2px solid #007bff';
    pieceElement.style.borderRadius = '8px';
    
    // Create image inside piece
    const img = document.createElement('img');
    img.src = currentPuzzle.image;
    img.style.position = 'absolute';
    img.style.width = `${pieceWidth * config.cols}px`;
    img.style.height = `${pieceHeight * config.rows}px`;
    img.style.left = `-${col * pieceWidth}px`;
    img.style.top = `-${row * pieceHeight}px`;
    img.style.objectFit = 'cover';
    img.style.pointerEvents = 'none';
    
    pieceElement.appendChild(img);
    
    pieceElement.addEventListener('dragstart', handleDragStart);
    pieceElement.addEventListener('dragend', handleDragEnd);
    pieceElement.addEventListener('click', handlePieceSelect);
    pieceElement.addEventListener('touchstart', handlePieceSelect);
    
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
  
  const placed = placePieceIntoSlot(pieceIndex, slotIndex, e.target);
  if (!placed) {
    speakText('Try a different spot!');
  }
}

// Tap-to-select on touch devices
function handlePieceSelect(e) {
  // Prevent scrolling when tapping
  e.preventDefault();
  const piece = e.currentTarget;
  if (piece.classList.contains('placed')) return;
  clearSelectedPiece();
  selectedPieceIndex = parseInt(piece.dataset.pieceIndex);
  piece.classList.add('selected');
}

function handleSlotSelect(e) {
  e.preventDefault();
  const slot = e.currentTarget;
  if (slot.classList.contains('filled')) return;
  if (selectedPieceIndex === null) {
    speakText('Tap a piece first, then tap the correct slot.');
    return;
  }
  const placed = placePieceIntoSlot(selectedPieceIndex, parseInt(slot.dataset.slotIndex), slot);
  if (!placed) {
    speakText('Try a different spot!');
  }
  clearSelectedPiece();
}

// Shared placement helper
function placePieceIntoSlot(pieceIndex, slotIndex, slotElement) {
  if (pieceIndex !== slotIndex || slotElement.classList.contains('filled')) {
    return false;
  }
  const originalPiece = document.querySelector(`[data-piece-index="${pieceIndex}"]`);
  if (!originalPiece || originalPiece.classList.contains('placed')) {
    return false;
  }
  const clonedPiece = originalPiece.cloneNode(true);
  clonedPiece.draggable = false;
  clonedPiece.style.border = 'none';
  slotElement.innerHTML = '';
  slotElement.appendChild(clonedPiece);
  slotElement.classList.add('filled');
  slotElement.classList.add('piece-snap');
  originalPiece.classList.add('placed');
  placedPieces++;
  updatePiecesDisplay();
  speakText('Great!');
  if (placedPieces === totalPieces) {
    completePuzzle();
  }
  return true;
}

function clearSelectedPiece() {
  selectedPieceIndex = null;
  document.querySelectorAll('.puzzle-piece.selected').forEach(piece => piece.classList.remove('selected'));
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
  clearSelectedPiece();
  
  // Reset UI
  const preview = document.getElementById('object-preview');
  const gameArea = document.getElementById('game-area');
  const startBtn = document.getElementById('start-puzzle');
  const newBtn = document.getElementById('new-puzzle');
  const instructionText = document.getElementById('instruction-text');
  const referenceImage = document.getElementById('reference-image');
  
  if (preview) preview.style.display = 'block';
  if (gameArea) gameArea.style.display = 'none';
  if (startBtn) startBtn.style.display = 'inline-block';
  if (newBtn) newBtn.style.display = 'none';
  if (referenceImage) referenceImage.style.display = 'none';
  if (instructionText) {
    instructionText.textContent = 'Listen to the object name and put the pieces back together!';
  }
  
  showObjectPreview();
}

// Reset current puzzle
function resetPuzzle() {
  if (!gameStarted) return;
  
  placedPieces = 0;
  clearSelectedPiece();
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

// Change difficulty
function changeDifficulty(difficulty) {
  jigsawDifficulty = difficulty;
  
  // Update active difficulty button
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');
  
  // Reset game if needed
  if (!gameStarted) {
    showObjectPreview();
  } else {
    newPuzzle();
  }
  
  speakText(`${difficulty} difficulty selected!`);
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
  
  // Difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      changeDifficulty(e.target.dataset.difficulty);
    });
  });
  
  // Initialize first object
  showObjectPreview();
  
  // Save progress periodically
  setInterval(saveProgress, 10000);
  
  // Welcome message
  setTimeout(() => {
    speakText('Welcome to Jigsaw Puzzle! Choose a difficulty and category, then click start to begin!');
  }, 1000);
});

// Save progress when leaving the page
window.addEventListener('beforeunload', saveProgress);