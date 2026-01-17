/* =========================
   SPOT THE DIFFERENCE - GAME LOGIC (IMPROVED)
========================= */

// Scene definitions with differences - MANY MORE SCENES NOW!
const scenes = {
  easy: [
    {
      name: 'Simple Scene',
      differences: [
        { x: 80, y: 100, radius: 25, type: 'missing', description: 'star missing' },
        { x: 280, y: 150, radius: 25, type: 'color', description: 'different color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = hasDifferences ? '#FFD700' : '#FFC700';
        ctx.beginPath();
        ctx.arc(60, 50, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(150, 60, 40, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(180, 150, 40, 80);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(200, 130, 50, 0, Math.PI * 2);
        ctx.fill();
        if (!hasDifferences) {
          ctx.fillStyle = '#FF69B4';
          ctx.beginPath();
          ctx.arc(80, 100, 15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 220, 400, 80);
      }
    },
    {
      name: 'Beach Fun',
      differences: [
        { x: 150, y: 80, radius: 25, type: 'missing', description: 'cloud' },
        { x: 280, y: 180, radius: 20, type: 'color', description: 'umbrella color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 150);
        ctx.fillStyle = '#1E90FF';
        ctx.fillRect(0, 150, 400, 150);
        if (!hasDifferences) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(150, 80, 35, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(350, 40, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hasDifferences ? '#FF6347' : '#FFD700';
        ctx.beginPath();
        ctx.arc(280, 170, 25, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(280, 170);
        ctx.lineTo(280, 200);
        ctx.stroke();
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(0, 200, 400, 100);
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(100, 220, 30, 30);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(140, 220);
        ctx.lineTo(140, 270);
        ctx.stroke();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(140, 220, 15, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      name: 'Garden Scene',
      differences: [
        { x: 200, y: 100, radius: 20, type: 'missing', description: 'butterfly' },
        { x: 100, y: 230, radius: 15, type: 'color', description: 'flower color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(60, 50, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(320, 70, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hasDifferences ? '#FF69B4' : '#FF1493';
        ctx.beginPath();
        ctx.arc(100, 230, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(200, 240, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(300, 230, 15, 0, Math.PI * 2);
        ctx.fill();
        if (!hasDifferences) {
          ctx.fillStyle = '#FFB6C1';
          ctx.beginPath();
          ctx.arc(200, 100, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(200, 80, 10, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 200, 400, 100);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(150, 240, 25, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    {
      name: 'Fun House',
      differences: [
        { x: 100, y: 90, radius: 20, type: 'missing', description: 'door window' },
        { x: 300, y: 160, radius: 18, type: 'color', description: 'flower color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(80, 100, 200, 140);
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(80, 100);
        ctx.lineTo(180, 40);
        ctx.lineTo(280, 100);
        ctx.fill();
        if (!hasDifferences) {
          ctx.fillStyle = '#87CEEB';
          ctx.fillRect(100, 90, 30, 30);
        }
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(150, 180, 40, 60);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(170, 210, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 240, 400, 60);
        ctx.fillStyle = hasDifferences ? '#FF6347' : '#FF1493';
        ctx.beginPath();
        ctx.arc(300, 240, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  ],
  medium: [
    {
      name: 'House Scene',
      differences: [
        { x: 280, y: 130, radius: 25, type: 'missing', description: 'window missing' },
        { x: 150, y: 210, radius: 20, type: 'color', description: 'door color' },
        { x: 60, y: 50, radius: 20, type: 'extra', description: 'extra bird' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(80, 120, 200, 120);
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(80, 120);
        ctx.lineTo(180, 60);
        ctx.lineTo(280, 120);
        ctx.fill();
        ctx.fillStyle = hasDifferences ? '#8B0000' : '#654321';
        ctx.fillRect(150, 180, 40, 60);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(185, 210, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(110, 150, 30, 30);
        if (!hasDifferences) {
          ctx.fillRect(250, 150, 30, 30);
        }
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(110, 150, 30, 30);
        if (!hasDifferences) {
          ctx.strokeRect(250, 150, 30, 30);
        }
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(50, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        if (hasDifferences) {
          ctx.beginPath();
          ctx.arc(100, 40, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, 240, 400, 60);
      }
    },
    {
      name: 'Ocean Scene',
      differences: [
        { x: 80, y: 100, radius: 25, type: 'missing', description: 'starfish' },
        { x: 200, y: 180, radius: 20, type: 'color', description: 'fish color' },
        { x: 320, y: 120, radius: 20, type: 'extra', description: 'extra coral' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#4A90E2';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#F4A460';
        ctx.fillRect(0, 200, 400, 100);
        ctx.fillStyle = hasDifferences ? '#FF6347' : '#FFD700';
        ctx.beginPath();
        ctx.ellipse(200, 180, 30, 20, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(220, 175, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.ellipse(100, 120, 25, 15, -0.2, 0, Math.PI * 2);
        ctx.fill();
        if (!hasDifferences) {
          ctx.fillStyle = '#FF1493';
          ctx.beginPath();
          ctx.arc(80, 100, 12, 0, Math.PI * 2);
          ctx.fill();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5);
            ctx.beginPath();
            ctx.arc(80 + Math.cos(angle) * 20, 100 + Math.sin(angle) * 20, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(150, 220);
        ctx.lineTo(140, 180);
        ctx.lineTo(160, 190);
        ctx.fill();
        if (hasDifferences) {
          ctx.beginPath();
          ctx.moveTo(320, 240);
          ctx.lineTo(310, 180);
          ctx.lineTo(330, 190);
          ctx.fill();
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(50 + i * 50, 100 - i * 20, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    },
    {
      name: 'Playground',
      differences: [
        { x: 120, y: 100, radius: 30, type: 'missing', description: 'swing' },
        { x: 260, y: 140, radius: 25, type: 'color', description: 'slide color' },
        { x: 180, y: 220, radius: 20, type: 'extra', description: 'extra ball' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(350, 40, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(80, 50, 30, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        if (!hasDifferences) {
          ctx.strokeStyle = '#8B4513';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(100, 80);
          ctx.lineTo(140, 140);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(140, 80);
          ctx.lineTo(100, 140);
          ctx.stroke();
          ctx.fillStyle = '#FF69B4';
          ctx.fillRect(100, 140, 40, 20);
        }
        ctx.fillStyle = hasDifferences ? '#FF6347' : '#FFD700';
        ctx.beginPath();
        ctx.moveTo(260, 80);
        ctx.lineTo(300, 200);
        ctx.lineTo(280, 200);
        ctx.lineTo(240, 80);
        ctx.fill();
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          const y = 80 + i * 24;
          ctx.beginPath();
          ctx.moveTo(240, y);
          ctx.lineTo(260, y);
          ctx.stroke();
        }
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(50, 220, 100, 15);
        ctx.beginPath();
        ctx.moveTo(90, 235);
        ctx.lineTo(80, 250);
        ctx.lineTo(100, 250);
        ctx.fill();
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(200, 220, 12, 0, Math.PI * 2);
        ctx.fill();
        if (hasDifferences) {
          ctx.beginPath();
          ctx.arc(180, 220, 12, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 240, 400, 60);
      }
    }
  ],
  hard: [
    {
      name: 'Forest Adventure',
      differences: [
        { x: 100, y: 80, radius: 20, type: 'missing', description: 'bird' },
        { x: 280, y: 200, radius: 20, type: 'color', description: 'flower color' },
        { x: 150, y: 240, radius: 20, type: 'extra', description: 'mushroom' },
        { x: 320, y: 140, radius: 20, type: 'missing', description: 'butterfly' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(340, 40, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.ellipse(100, 60, 35, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(50, 180, 25, 60);
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(62, 160, 40, 0, Math.PI * 2);
        ctx.fill();
        if (!hasDifferences) {
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(50, 80, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(280, 180, 25, 60);
        ctx.fillStyle = '#32CD32';
        ctx.beginPath();
        ctx.arc(292, 160, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(150, 240, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hasDifferences ? '#FF69B4' : '#FF1493';
        ctx.beginPath();
        ctx.arc(280, 240, 12, 0, Math.PI * 2);
        ctx.fill();
        if (hasDifferences) {
          ctx.fillStyle = '#FFB6C1';
          ctx.beginPath();
          ctx.arc(320, 140, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(320, 120, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FF6347';
          ctx.beginPath();
          ctx.arc(150, 220, 15, Math.PI, 0);
          ctx.fill();
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(140, 220, 20, 20);
        }
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, 240, 400, 60);
      }
    },
    {
      name: 'City Street',
      differences: [
        { x: 80, y: 100, radius: 20, type: 'missing', description: 'window' },
        { x: 240, y: 150, radius: 20, type: 'color', description: 'car color' },
        { x: 150, y: 180, radius: 20, type: 'extra', description: 'traffic light' },
        { x: 320, y: 120, radius: 20, type: 'missing', description: 'cloud' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 400, 300);
        if (!hasDifferences) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(320, 120, 30, 15, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(20, 80, 120, 160);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 4; j++) {
            if (!(i === 0 && j === 0)) {
              ctx.fillStyle = '#FFD700';
              ctx.fillRect(40 + i * 30, 100 + j * 30, 20, 20);
            }
          }
        }
        ctx.fillStyle = '#4169E1';
        ctx.fillRect(180, 60, 120, 180);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 5; j++) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(200 + i * 30, 80 + j * 30, 20, 20);
          }
        }
        ctx.fillStyle = hasDifferences ? '#FFD700' : '#FF0000';
        ctx.fillRect(260, 230, 80, 30);
        ctx.fillRect(270, 210, 60, 20);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(280, 260, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(330, 260, 8, 0, Math.PI * 2);
        ctx.fill();
        if (hasDifferences) {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(145, 140, 20, 60);
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(155, 150, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(155, 170, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#00FF00';
          ctx.beginPath();
          ctx.arc(155, 190, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    {
      name: 'Party Time',
      differences: [
        { x: 80, y: 80, radius: 20, type: 'missing', description: 'balloon' },
        { x: 200, y: 150, radius: 25, type: 'color', description: 'cake color' },
        { x: 300, y: 200, radius: 20, type: 'extra', description: 'present' },
        { x: 150, y: 120, radius: 20, type: 'missing', description: 'star' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(0, 0, 400, 300);
        if (!hasDifferences) {
          ctx.fillStyle = '#FF69B4';
          ctx.beginPath();
          ctx.arc(80, 80, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#FF1493';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(80, 95);
          ctx.lineTo(80, 150);
          ctx.stroke();
        }
        if (!hasDifferences) {
          ctx.fillStyle = '#FFD700';
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const x = 150 + Math.cos(angle) * 12;
            const y = 120 + Math.sin(angle) * 12;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = hasDifferences ? '#87CEEB' : '#FFD700';
        ctx.beginPath();
        ctx.arc(200, 150, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FF1493';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(170, 150);
        ctx.lineTo(230, 150);
        ctx.stroke();
        if (hasDifferences) {
          ctx.fillStyle = '#FF6347';
          ctx.fillRect(280, 180, 40, 40);
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(300, 200, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#228B22';
        ctx.fillRect(50, 240, 300, 60);
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
let canvasLeftElement = null;
let canvasRightElement = null;

document.addEventListener('DOMContentLoaded', function() {
  const canvasLeft = document.getElementById('canvas-left');
  const canvasRight = document.getElementById('canvas-right');
  
  canvasLeft.width = 400;
  canvasLeft.height = 300;
  canvasRight.width = 400;
  canvasRight.height = 300;
  
  canvasLeftElement = canvasLeft;
  canvasRightElement = canvasRight;
  
  canvasLeftContext = canvasLeft.getContext('2d');
  canvasRightContext = canvasRight.getContext('2d');
  
  setupDifficultyButtons();
  loadNewScene();
  
  canvasLeft.addEventListener('click', (e) => handleCanvasClick(e, canvasLeft, canvasLeftContext, 'left'));
  canvasRight.addEventListener('click', (e) => handleCanvasClick(e, canvasRight, canvasRightContext, 'right'));
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
  
  canvasLeftContext.clearRect(0, 0, 400, 300);
  canvasRightContext.clearRect(0, 0, 400, 300);
  
  currentScene.drawScene(canvasLeftContext, false);
  currentScene.drawScene(canvasRightContext, true);
}

function handleCanvasClick(event, canvas, ctx, side) {
  if (!gameActive || !currentScene) return;
  
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  
  for (let i = 0; i < currentScene.differences.length; i++) {
    if (foundDifferences.has(i)) continue;
    
    const diff = currentScene.differences[i];
    const distance = Math.sqrt(Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2));
    
    if (distance <= (diff.radius || 30)) {
      foundDifferences.add(i);
      document.getElementById('found').textContent = foundDifferences.size;
      
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(diff.x, diff.y, diff.radius || 30, 0, Math.PI * 2);
      ctx.stroke();
      
      playCorrectSound();
      
      if (foundDifferences.size === currentScene.differences.length) {
        completeScene();
      }
      return;
    }
  }
  
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
  window.history.back();
}
