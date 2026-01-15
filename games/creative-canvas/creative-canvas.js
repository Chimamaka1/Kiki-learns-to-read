// Creative Canvas Game Logic
let canvas, ctx;
let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#ff0000';
let currentBrushSize = 'medium';
let currentStamp = '🌟';

// Brush sizes
const brushSizes = {
  small: 3,
  medium: 8,
  large: 15
};

// Encouragement messages
const encouragementMessages = [
  "Amazing artwork! You're so creative! 🎨",
  "Beautiful colors! Keep going! 🌈",
  "Wow! That looks fantastic! ⭐",
  "You're a wonderful artist! 🎭",
  "Such creativity! I love it! 💖",
  "Keep creating magic! ✨",
  "Your imagination is incredible! 🦋",
  "What a masterpiece! 🖼️"
];

// Navigation function
function goBack() {
  window.history.back();
}

// Initialize canvas
function initCanvas() {
  canvas = document.getElementById('drawing-canvas');
  ctx = canvas.getContext('2d');
  
  // Set canvas size
  const containerWidth = Math.min(800, window.innerWidth - 60);
  const containerHeight = Math.min(500, window.innerHeight - 300);
  
  canvas.width = containerWidth;
  canvas.height = containerHeight;
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = containerHeight + 'px';
  
  // Set initial canvas background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Set default drawing properties
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

// Get mouse/touch position
function getPosition(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  const clientY = e.clientY || (e.touches && e.touches[0].clientY);
  
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

// Start drawing
function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  const pos = getPosition(e);
  
  if (currentTool === 'brush') {
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  } else if (currentTool === 'stamp') {
    addStamp(pos.x, pos.y);
  }
}

// Draw
function draw(e) {
  e.preventDefault();
  if (!isDrawing || currentTool !== 'brush') return;
  
  const pos = getPosition(e);
  
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSizes[currentBrushSize];
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
}

// Stop drawing
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;
    showRandomEncouragement();
  }
}

// Add stamp to canvas
function addStamp(x, y) {
  const fontSize = brushSizes[currentBrushSize] * 3;
  ctx.font = `${fontSize}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add stamp with animation effect
  ctx.save();
  ctx.translate(x, y);
  ctx.fillText(currentStamp, 0, 0);
  ctx.restore();
  
  showRandomEncouragement();
}

// Show random encouragement message
function showRandomEncouragement() {
  const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  const encouragementElement = document.getElementById('encouragement-text');
  if (encouragementElement) {
    encouragementElement.textContent = message;
    speakText(message.replace(/[🎨🌈⭐🎭💖✨🦋🖼️]/g, '')); // Remove emojis for speech
  }
}

// Clear canvas
function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  speakText("Canvas cleared! Ready for a new masterpiece!");
}

// Save artwork
function saveArtwork() {
  try {
    const link = document.createElement('a');
    link.download = `artwork_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    speakText("Your beautiful artwork has been saved!");
    showRandomEncouragement();
  } catch (error) {
    console.error('Could not save artwork:', error);
    speakText("Great job on your artwork!");
  }
}

// Set up event listeners
function setupEventListeners() {
  // Canvas drawing events
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // Touch events for mobile
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchcancel', stopDrawing);
  
  // Brush size buttons
  document.querySelectorAll('.brush-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBrushSize = btn.dataset.size;
      currentTool = 'brush';
      canvas.style.cursor = 'crosshair';
    });
  });
  
  // Color buttons
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.dataset.color;
      currentTool = 'brush';
      canvas.style.cursor = 'crosshair';
    });
  });
  
  // Stamp buttons
  document.querySelectorAll('.stamp-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stamp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStamp = btn.dataset.stamp;
      currentTool = 'stamp';
      canvas.style.cursor = 'pointer';
    });
  });
  
  // Action buttons
  document.getElementById('clear-canvas').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your artwork?')) {
      clearCanvas();
    }
  });
  
  document.getElementById('save-artwork').addEventListener('click', saveArtwork);
}

// Handle window resize
function handleResize() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  initCanvas();
  ctx.putImageData(imageData, 0, 0);
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  initCanvas();
  setupEventListeners();
  
  // Handle window resize
  window.addEventListener('resize', handleResize);
  
  // Welcome message
  setTimeout(() => {
    speakText("Welcome to your creative canvas! Choose colors, brushes, or stamps and start creating!");
  }, 1000);
});

// Prevent scrolling when drawing on touch devices
document.body.addEventListener('touchstart', function(e) {
  if (e.target === canvas) {
    e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener('touchend', function(e) {
  if (e.target === canvas) {
    e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener('touchmove', function(e) {
  if (e.target === canvas) {
    e.preventDefault();
  }
}, { passive: false });