/* =========================
   SPOT THE DIFFERENCE - GAME LOGIC
========================= */

// Scene definitions with differences
const scenes = {
  easy: [
    {
      name: 'Simple Scene',
      differences: [
        { x: 80, y: 100, type: 'missing', description: 'star missing' },
        { x: 180, y: 150, type: 'color', description: 'different color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        
        // Sun
        ctx.fillStyle = hasDifferences ? '#FFD700' : '#FFC700';
        ctx.beginPath();
        ctx.arc(60, 50, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(150, 60, 40, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(180, 150, 40, 80);
        
        // Tree leaves
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(200, 130, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Flower
        if (!hasDifferences) {
          ctx.fillStyle = '#FF69B4';
          ctx.beginPath();
          ctx.arc(80, 200, 15, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 220, 400, 80);
      }
    },
    {
      name: 'Animal Scene',
      differences: [
        { x: 100, y: 120, type: 'missing', description: 'tail missing' },
        { x: 280, y: 180, type: 'extra', description: 'extra flower' }
      ],
      drawScene: (ctx, hasDifferences) => {
        // Sky
        ctx.fillStyle = '#E0F6FF';
        ctx.fillRect(0, 0, 400, 300);
        
        // Cat body
        ctx.fillStyle = '#FF9F43';
        ctx.fillRect(60, 140, 80, 60);
        
        // Cat head
        ctx.beginPath();
        ctx.arc(100, 120, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Cat ears
        ctx.beginPath();
        ctx.moveTo(75, 95);
        ctx.lineTo(70, 60);
        ctx.lineTo(85, 95);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(125, 95);
        ctx.lineTo(130, 60);
        ctx.lineTo(115, 95);
        ctx.fill();
        
        // Cat tail
        if (!hasDifferences) {
          ctx.strokeStyle = '#FF9F43';
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.moveTo(140, 160);
          ctx.quadraticCurveTo(180, 140, 200, 100);
          ctx.stroke();
        }
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(90, 115, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(110, 115, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 220, 400, 80);
        
        // Flowers
        ctx.fillStyle = '#FF69B4';
        ctx.beginPath();
        ctx.arc(250, 200, 12, 0, Math.PI * 2);
        ctx.fill();
        
        if (hasDifferences) {
          ctx.fillStyle = '#FFB6C1';
          ctx.beginPath();
          ctx.arc(300, 200, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  ],
  medium: [
    {
      name: 'House Scene',
      differences: [
        { x: 250, y: 120, type: 'missing', description: 'window missing' },
        { x: 80, y: 180, type: 'color', description: 'door color' },
        { x: 180, y: 80, type: 'extra', description: 'extra bird' }
      ],
      drawScene: (ctx, hasDifferences) => {
        // Sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        
        // House
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(80, 120, 200, 120);
        
        // Roof
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(80, 120);
        ctx.lineTo(180, 60);
        ctx.lineTo(280, 120);
        ctx.fill();
        
        // Door
        ctx.fillStyle = hasDifferences ? '#8B0000' : '#654321';
        ctx.fillRect(160, 180, 40, 60);
        
        // Door knob
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(195, 210, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(110, 150, 30, 30);
        if (!hasDifferences) {
          ctx.fillRect(250, 150, 30, 30);
        }
        
        // Window frames
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(110, 150, 30, 30);
        if (!hasDifferences) {
          ctx.strokeRect(250, 150, 30, 30);
        }
        
        // Birds
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(50, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        
        if (hasDifferences) {
          ctx.beginPath();
          ctx.arc(120, 40, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Ground
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 240, 400, 60);
      }
    }
  ],
  hard: [
    {
      name: 'Complex Scene',
      differences: [
        { x: 100, y: 80, type: 'missing', description: 'cloud' },
        { x: 280, y: 150, type: 'color', description: 'flower color' },
        { x: 150, y: 220, type: 'extra', description: 'mushroom' },
        { x: 50, y: 140, type: 'missing', description: 'butterfly' }
      ],
      drawScene: (ctx, hasDifferences) => {
        // Sky
        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(0, 0, 400, 300);
        
        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(340, 40, 25, 0, Math.PI * 2);
        ctx.fill();
        
        // Cloud
        if (!hasDifferences) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(100, 80, 35, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Tree 1
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(50, 180, 25, 60);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(62, 160, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Tree 2
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(280, 180, 25, 60);
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(292, 160, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // Flowers
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(150, 220, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = hasDifferences ? '#FF69B4' : '#FF1493';
        ctx.beginPath();
        ctx.arc(280, 220, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Butterfly
        if (hasDifferences) {
          ctx.fillStyle = '#FFB6C1';
          ctx.beginPath();
          ctx.arc(50, 140, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(50, 120, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Mushroom
        if (hasDifferences) {
          ctx.fillStyle = '#FF6347';
          ctx.beginPath();
          ctx.arc(150, 200, 15, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(140, 200, 20, 20);
        }
        
        // Ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 240, 400, 60);
      }
    }
  ]
};

let currentDifficulty = 'easy';
let currentSceneIndex = 0;
let foundDifferences = new Set();
let currentScene = null;
let canvasLeftContext = null;
let canvasRightContext = null;
let gameActive = false;

document.addEventListener('DOMContentLoaded', function() {
  const canvasLeft = document.getElementById('canvas-left');
  const canvasRight = document.getElementById('canvas-right');
  
  canvasLeft.width = 400;
  canvasLeft.height = 300;
  canvasRight.width = 400;
  canvasRight.height = 300;
  
  canvasLeftContext = canvasLeft.getContext('2d');
  canvasRightContext = canvasRight.getContext('2d');
  
  setupDifficultyButtons();
  loadNewScene();
  
  // Add click handlers
  canvasLeft.addEventListener('click', (e) => handleCanvasClick(e, 'left'));
  canvasRight.addEventListener('click', (e) => handleCanvasClick(e, 'right'));
});

function setupDifficultyButtons() {
  const buttons = document.querySelectorAll('.difficulty-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function() {
      buttons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentDifficulty = this.dataset.difficulty;
      currentSceneIndex = 0;
      foundDifferences.clear();
      loadNewScene();
    });
  });
}

function loadNewScene() {
  const sceneList = scenes[currentDifficulty];
  currentScene = sceneList[currentSceneIndex % sceneList.length];
  
  foundDifferences.clear();
  document.getElementById('found').textContent = '0';
  document.getElementById('total').textContent = currentScene.differences.length;
  document.getElementById('feedback-section').style.display = 'none';
  
  gameActive = true;
  
  // Draw scenes
  canvasLeftContext.clearRect(0, 0, 400, 300);
  canvasRightContext.clearRect(0, 0, 400, 300);
  
  currentScene.drawScene(canvasLeftContext, false);
  currentScene.drawScene(canvasRightContext, true);
}

function handleCanvasClick(event, side) {
  if (!gameActive) return;
  
  const canvas = event.target;
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  
  // Check if click is near a difference
  for (let i = 0; i < currentScene.differences.length; i++) {
    const diff = currentScene.differences[i];
    const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
    
    if (distance < 30 && !foundDifferences.has(i)) {
      foundDifferences.add(i);
      document.getElementById('found').textContent = foundDifferences.size;
      playCorrectSound();
      
      if (foundDifferences.size === currentScene.differences.length) {
        completeScene();
      }
      return;
    }
  }
  
  // Incorrect click
  playIncorrectSound();
}

function completeScene() {
  gameActive = false;
  const feedbackDiv = document.getElementById('feedback-section');
  const messageDiv = document.getElementById('feedback-message');
  
  messageDiv.textContent = '🎉 Amazing! You found all the differences!';
  messageDiv.className = 'feedback-message correct';
  feedbackDiv.style.display = 'block';
  
  celebrateSuccess();
  currentSceneIndex++;
}

async function playCorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Found one!');
    utterance.rate = 0.8;
    utterance.pitch = 1.3;
    synth.speak(utterance);
  }
}

async function playIncorrectSound() {
  const synth = window.speechSynthesis;
  if (synth) {
    const utterance = new SpeechSynthesisUtterance('Keep looking');
    utterance.rate = 0.8;
    synth.speak(utterance);
  }
}

function celebrateSuccess() {
  const celebration = document.getElementById('celebration');
  celebration.style.display = 'block';
  
  const colors = ['#4facfe', '#00f2fe', '#FFD700', '#FF69B4', '#228B22'];
  
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.delay = Math.random() * 0.5 + 's';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    celebration.appendChild(confetti);
  }
  
  setTimeout(() => {
    celebration.innerHTML = '';
    celebration.style.display = 'none';
  }, 3500);
}

function nextRound() {
  loadNewScene();
}

function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#logic-section';
}
