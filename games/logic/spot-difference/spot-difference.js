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
      name: 'Playground',
      differences: [
        { x: 90, y: 190, type: 'extra', description: 'extra swing seat' },
        { x: 250, y: 140, type: 'missing', description: 'missing kite tail' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#B3E5FC';
        ctx.fillRect(0, 0, 400, 300);

        // Slide
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(60, 120, 20, 120);
        ctx.beginPath();
        ctx.moveTo(80, 120);
        ctx.lineTo(160, 200);
        ctx.lineTo(140, 210);
        ctx.fill();

        // Swing frame
        ctx.strokeStyle = '#6D4C41';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(60, 90);
        ctx.lineTo(40, 230);
        ctx.moveTo(160, 90);
        ctx.lineTo(180, 230);
        ctx.moveTo(60, 90);
        ctx.lineTo(160, 90);
        ctx.stroke();

        // Swing seat(s)
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3E2723';
        ctx.beginPath();
        ctx.moveTo(90, 90);
        ctx.lineTo(90, 170);
        ctx.moveTo(120, 90);
        ctx.lineTo(120, 170);
        ctx.stroke();
        ctx.fillStyle = '#FF7043';
        ctx.fillRect(85, 170, 40, 12);

        if (hasDifferences) {
          ctx.beginPath();
          ctx.moveTo(130, 90);
          ctx.lineTo(130, 155);
          ctx.moveTo(160, 90);
          ctx.lineTo(160, 155);
          ctx.stroke();
          ctx.fillStyle = '#FF7043';
          ctx.fillRect(125, 155, 40, 12);
        }

        // Kite
        ctx.fillStyle = '#E91E63';
        ctx.beginPath();
        ctx.moveTo(260, 80);
        ctx.lineTo(290, 110);
        ctx.lineTo(260, 140);
        ctx.lineTo(230, 110);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#F06292';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(260, 140);
        if (!hasDifferences) {
          ctx.lineTo(250, 170);
          ctx.lineTo(240, 190);
          ctx.lineTo(230, 210);
        } else {
          ctx.lineTo(260, 170);
        }
        ctx.stroke();

        // Ground
        ctx.fillStyle = '#A5D6A7';
        ctx.fillRect(0, 230, 400, 70);
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
    ,
    {
      name: 'Garden Picnic',
      differences: [
        { x: 110, y: 190, type: 'extra', description: 'extra sandwich' },
        { x: 240, y: 150, type: 'missing', description: 'missing cloud' },
        { x: 300, y: 210, type: 'color', description: 'basket cloth color' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#B2EBF2';
        ctx.fillRect(0, 0, 400, 300);

        // Cloud
        if (!hasDifferences) {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(240, 80, 35, 18, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Picnic blanket
        ctx.fillStyle = hasDifferences ? '#FFAB91' : '#FFCCBC';
        ctx.fillRect(80, 200, 240, 60);

        // Basket
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(260, 180, 60, 30);
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 3;
        ctx.strokeRect(260, 180, 60, 30);

        // Sandwiches
        ctx.fillStyle = '#FFF9C4';
        ctx.fillRect(110, 210, 30, 15);
        ctx.fillRect(160, 210, 30, 15);
        ctx.fillRect(210, 210, 30, 15);
        if (hasDifferences) {
          ctx.fillRect(140, 190, 30, 15);
        }

        // Trees
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(40, 170, 18, 90);
        ctx.fillRect(340, 170, 18, 90);
        ctx.fillStyle = '#43A047';
        ctx.beginPath();
        ctx.arc(49, 150, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(349, 150, 40, 0, Math.PI * 2);
        ctx.fill();

        // Ground
        ctx.fillStyle = '#AED581';
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
    },
    {
      name: 'City Night',
      differences: [
        { x: 90, y: 110, type: 'missing', description: 'missing window light' },
        { x: 210, y: 160, type: 'extra', description: 'extra street lamp' },
        { x: 320, y: 80, type: 'color', description: 'moon color change' },
        { x: 150, y: 220, type: 'extra', description: 'extra car' }
      ],
      drawScene: (ctx, hasDifferences) => {
        ctx.fillStyle = '#1A237E';
        ctx.fillRect(0, 0, 400, 300);

        // Moon
        ctx.fillStyle = hasDifferences ? '#FFEB3B' : '#F5F5F5';
        ctx.beginPath();
        ctx.arc(330, 60, 25, 0, Math.PI * 2);
        ctx.fill();

        // Buildings
        ctx.fillStyle = '#3949AB';
        ctx.fillRect(40, 120, 80, 180);
        ctx.fillRect(150, 140, 100, 160);
        ctx.fillRect(270, 100, 90, 200);

        // Windows
        ctx.fillStyle = '#FFC107';
        ctx.fillRect(60, 150, 12, 12);
        ctx.fillRect(100, 150, 12, 12);
        ctx.fillRect(60, 190, 12, 12);
        if (!hasDifferences) {
          ctx.fillRect(100, 190, 12, 12);
        }

        ctx.fillRect(180, 170, 12, 12);
        ctx.fillRect(220, 170, 12, 12);
        ctx.fillRect(180, 200, 12, 12);
        ctx.fillRect(220, 200, 12, 12);

        ctx.fillRect(300, 140, 12, 12);
        ctx.fillRect(340, 140, 12, 12);
        ctx.fillRect(300, 180, 12, 12);
        ctx.fillRect(340, 180, 12, 12);

        // Street lamps
        ctx.strokeStyle = '#FFC107';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, 230);
        ctx.lineTo(40, 260);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(260, 230);
        ctx.lineTo(260, 260);
        ctx.stroke();
        if (hasDifferences) {
          ctx.beginPath();
          ctx.moveTo(210, 230);
          ctx.lineTo(210, 260);
          ctx.stroke();
        }

        // Cars
        ctx.fillStyle = '#FF5252';
        ctx.fillRect(90, 240, 50, 20);
        ctx.fillStyle = '#29B6F6';
        ctx.fillRect(230, 245, 50, 20);
        if (hasDifferences) {
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(150, 230, 50, 20);
        }

        // Road
        ctx.fillStyle = '#212121';
        ctx.fillRect(0, 260, 400, 40);
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
let foundMarkers = [];
let audioCtx = null;

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
  // Ensure audio context is primed after first user gesture (mobile/iPad)
  const unlock = () => { const ctx = ensureAudioCtx(); if (ctx && ctx.state === 'suspended') { ctx.resume().catch(()=>{}); } document.removeEventListener('pointerdown', unlock, { capture: true }); };
  document.addEventListener('pointerdown', unlock, { capture: true, once: true });
});

function ensureAudioCtx() {
  if (audioCtx) return audioCtx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = new Ctx();
  return audioCtx;
}

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
  foundMarkers = [];
  document.getElementById('found').textContent = '0';
  document.getElementById('total').textContent = currentScene.differences.length;
  document.getElementById('feedback-section').style.display = 'none';
  
  gameActive = true;
  renderCurrentScene();
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
      markDifference(diff);
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

function markDifference(diff) {
  foundMarkers.push(diff);
  renderCurrentScene();
  pulseMarker(canvasLeftContext, diff.x, diff.y);
  pulseMarker(canvasRightContext, diff.x, diff.y);
}

function drawMarker(ctx, x, y) {
  ctx.save();
  ctx.strokeStyle = '#00C853';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 24, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x - 2, y + 10);
  ctx.lineTo(x + 14, y - 12);
  ctx.stroke();
  ctx.restore();
}

function renderCurrentScene() {
  if (!currentScene || !canvasLeftContext || !canvasRightContext) return;
  canvasLeftContext.clearRect(0, 0, 400, 300);
  canvasRightContext.clearRect(0, 0, 400, 300);
  currentScene.drawScene(canvasLeftContext, false);
  currentScene.drawScene(canvasRightContext, true);
  foundMarkers.forEach(diff => {
    drawMarker(canvasLeftContext, diff.x, diff.y);
    drawMarker(canvasRightContext, diff.x, diff.y);
  });
}

function pulseMarker(ctx, x, y) {
  const start = performance.now();
  const duration = 220;
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const scale = 1 + 0.35 * Math.sin(t * Math.PI);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-x, -y);
    ctx.globalAlpha = 0.8;
    drawMarker(ctx, x, y);
    ctx.restore();
    if (t < 1) requestAnimationFrame(step);
    else renderCurrentScene();
  }
  requestAnimationFrame(step);
}

async function playCorrectSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.18);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

async function playIncorrectSound() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);
  gain.gain.setValueAtTime(0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
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
