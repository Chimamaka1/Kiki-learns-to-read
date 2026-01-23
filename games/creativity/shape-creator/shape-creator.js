// Shape Creator Game Logic
let currentShape = 'circle';
let currentColor = '#FF6B6B';
let currentSize = 60;
let shapeHistory = [];
let svgNamespace = 'http://www.w3.org/2000/svg';

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
  initializeShapeCreator();
});

function initializeShapeCreator() {
  // Set up shape buttons
  document.querySelectorAll('.shape-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      selectShape(this.dataset.shape, this);
    });
  });

  // Set up color buttons
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      selectColor(this.dataset.color, this);
    });
  });

  // Set up size slider
  const sizeSlider = document.getElementById('size-slider');
  sizeSlider.addEventListener('input', function() {
    currentSize = this.value;
    document.getElementById('size-display').textContent = currentSize + 'px';
    document.getElementById('size-info').textContent = currentSize + 'px';
  });

  // Set up canvas click event
  const canvas = document.getElementById('drawing-canvas');
  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    drawShape(x, y);
  });

  // Set default selections
  document.querySelectorAll('.shape-btn').forEach(btn => {
    if (btn.dataset.shape === 'circle') {
      btn.classList.add('active');
    }
  });

  document.querySelectorAll('.color-btn').forEach(btn => {
    if (btn.dataset.color === '#FF6B6B') {
      btn.classList.add('active');
    }
  });

  loadDrawingFromStorage();
}

function selectShape(shape, element) {
  currentShape = shape;
  document.querySelectorAll('.shape-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');

  const shapeNames = {
    'circle': 'Circle',
    'square': 'Square',
    'triangle': 'Triangle',
    'rectangle': 'Rectangle',
    'star': 'Star',
    'heart': 'Heart'
  };

  document.getElementById('current-shape').textContent = shapeNames[shape];
}

function selectColor(color, element) {
  currentColor = color;
  document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
  document.getElementById('current-color').style.backgroundColor = color;
}

function drawShape(x, y) {
  const canvas = document.getElementById('drawing-canvas');
  let element;

  switch(currentShape) {
    case 'circle':
      element = createCircle(x, y);
      break;
    case 'square':
      element = createSquare(x, y);
      break;
    case 'triangle':
      element = createTriangle(x, y);
      break;
    case 'rectangle':
      element = createRectangle(x, y);
      break;
    case 'star':
      element = createStar(x, y);
      break;
    case 'heart':
      element = createHeart(x, y);
      break;
  }

  if (element) {
    canvas.appendChild(element);
    shapeHistory.push({
      type: currentShape,
      color: currentColor,
      size: currentSize,
      x: x,
      y: y
    });
    saveDrawingToStorage();
  }
}

function createCircle(x, y) {
  const circle = document.createElementNS(svgNamespace, 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', currentSize / 2);
  circle.setAttribute('fill', currentColor);
  circle.setAttribute('opacity', '0.9');
  circle.style.cursor = 'pointer';
  addDeleteListener(circle);
  return circle;
}

function createSquare(x, y) {
  const square = document.createElementNS(svgNamespace, 'rect');
  square.setAttribute('x', x - currentSize / 2);
  square.setAttribute('y', y - currentSize / 2);
  square.setAttribute('width', currentSize);
  square.setAttribute('height', currentSize);
  square.setAttribute('fill', currentColor);
  square.setAttribute('opacity', '0.9');
  square.setAttribute('rx', '5');
  square.style.cursor = 'pointer';
  addDeleteListener(square);
  return square;
}

function createRectangle(x, y) {
  const rect = document.createElementNS(svgNamespace, 'rect');
  rect.setAttribute('x', x - (currentSize * 1.5) / 2);
  rect.setAttribute('y', y - currentSize / 2);
  rect.setAttribute('width', currentSize * 1.5);
  rect.setAttribute('height', currentSize);
  rect.setAttribute('fill', currentColor);
  rect.setAttribute('opacity', '0.9');
  rect.setAttribute('rx', '5');
  rect.style.cursor = 'pointer';
  addDeleteListener(rect);
  return rect;
}

function createTriangle(x, y) {
  const triangle = document.createElementNS(svgNamespace, 'polygon');
  const size = currentSize;
  const points = `${x},${y - size/2} ${x + size/2},${y + size/2} ${x - size/2},${y + size/2}`;
  triangle.setAttribute('points', points);
  triangle.setAttribute('fill', currentColor);
  triangle.setAttribute('opacity', '0.9');
  triangle.style.cursor = 'pointer';
  addDeleteListener(triangle);
  return triangle;
}

function createStar(x, y) {
  const size = currentSize;
  const points = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? size / 2 : size / 4;
    points.push([
      x + radius * Math.cos(angle),
      y + radius * Math.sin(angle)
    ]);
  }

  const star = document.createElementNS(svgNamespace, 'polygon');
  star.setAttribute('points', points.map(p => p.join(',')).join(' '));
  star.setAttribute('fill', currentColor);
  star.setAttribute('opacity', '0.9');
  star.style.cursor = 'pointer';
  addDeleteListener(star);
  return star;
}

function createHeart(x, y) {
  const size = currentSize;
  const scale = size / 30;
  
  // Heart SVG path
  const path = document.createElementNS(svgNamespace, 'path');
  const d = `M${x},${y + size/4} 
             C${x},${y + size/4} ${x - size/2},${y - size/4} ${x - size/2},${y - size/6}
             C${x - size/2},${y - size/2} ${x},${y - size/2} ${x},${y}
             C${x},${y - size/2} ${x + size/2},${y - size/2} ${x + size/2},${y - size/6}
             C${x + size/2},${y - size/4} ${x},${y + size/4} ${x},${y + size/4} Z`;
  
  path.setAttribute('d', d);
  path.setAttribute('fill', currentColor);
  path.setAttribute('opacity', '0.9');
  path.style.cursor = 'pointer';
  addDeleteListener(path);
  return path;
}

function addDeleteListener(element) {
  element.addEventListener('click', function(e) {
    e.stopPropagation();
    element.remove();
    shapeHistory.pop();
    saveDrawingToStorage();
  });

  element.addEventListener('mouseover', function() {
    this.setAttribute('opacity', '1');
    this.setAttribute('stroke', '#333');
    this.setAttribute('stroke-width', '2');
  });

  element.addEventListener('mouseout', function() {
    this.setAttribute('opacity', '0.9');
    this.removeAttribute('stroke');
  });
}

function undoShape() {
  if (shapeHistory.length > 0) {
    shapeHistory.pop();
    redrawCanvas();
    saveDrawingToStorage();
  }
}

function clearCanvas() {
  const canvas = document.getElementById('drawing-canvas');
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }
  shapeHistory = [];
  saveDrawingToStorage();
}

function redrawCanvas() {
  const canvas = document.getElementById('drawing-canvas');
  while (canvas.firstChild) {
    canvas.removeChild(canvas.firstChild);
  }

  shapeHistory.forEach(shapeData => {
    currentColor = shapeData.color;
    currentSize = shapeData.size;
    currentShape = shapeData.type;
    
    let element;
    switch(shapeData.type) {
      case 'circle':
        element = createCircle(shapeData.x, shapeData.y);
        break;
      case 'square':
        element = createSquare(shapeData.x, shapeData.y);
        break;
      case 'triangle':
        element = createTriangle(shapeData.x, shapeData.y);
        break;
      case 'rectangle':
        element = createRectangle(shapeData.x, shapeData.y);
        break;
      case 'star':
        element = createStar(shapeData.x, shapeData.y);
        break;
      case 'heart':
        element = createHeart(shapeData.x, shapeData.y);
        break;
    }
    
    if (element) {
      canvas.appendChild(element);
    }
  });
}

// Template Shapes
const templates = {
  house: [
    { type: 'rectangle', color: '#CD853F', size: 150, x: 350, y: 350 },
    { type: 'triangle', color: '#8B4513', size: 150, x: 350, y: 200 },
    { type: 'square', color: '#FFD700', size: 40, x: 300, y: 300 },
    { type: 'square', color: '#FFD700', size: 40, x: 400, y: 300 },
    { type: 'square', color: '#8B0000', size: 60, x: 350, y: 380 }
  ],
  tree: [
    { type: 'rectangle', color: '#8B4513', size: 40, x: 400, y: 400 },
    { type: 'circle', color: '#228B22', size: 100, x: 400, y: 250 },
    { type: 'circle', color: '#228B22', size: 80, x: 350, y: 280 },
    { type: 'circle', color: '#228B22', size: 80, x: 450, y: 280 }
  ],
  flower: [
    { type: 'rectangle', color: '#228B22', size: 20, x: 400, y: 350 },
    { type: 'circle', color: '#FFD700', size: 40, x: 400, y: 300 },
    { type: 'circle', color: '#FF69B4', size: 50, x: 350, y: 280 },
    { type: 'circle', color: '#FF69B4', size: 50, x: 450, y: 280 },
    { type: 'circle', color: '#FF69B4', size: 50, x: 400, y: 230 },
    { type: 'circle', color: '#FF69B4', size: 50, x: 400, y: 330 }
  ],
  sun: [
    { type: 'circle', color: '#FFD700', size: 100, x: 400, y: 300 },
    { type: 'rectangle', color: '#FFD700', size: 60, x: 400, y: 120 },
    { type: 'rectangle', color: '#FFD700', size: 60, x: 400, y: 480 },
    { type: 'rectangle', color: '#FFD700', size: 60, x: 280, y: 300 },
    { type: 'rectangle', color: '#FFD700', size: 60, x: 520, y: 300 },
    { type: 'rectangle', color: '#FFD700', size: 50, x: 280, y: 180 },
    { type: 'rectangle', color: '#FFD700', size: 50, x: 520, y: 180 },
    { type: 'rectangle', color: '#FFD700', size: 50, x: 280, y: 420 },
    { type: 'rectangle', color: '#FFD700', size: 50, x: 520, y: 420 }
  ],
  face: [
    { type: 'circle', color: '#FDBCB4', size: 120, x: 400, y: 300 },
    { type: 'circle', color: '#000000', size: 20, x: 370, y: 270 },
    { type: 'circle', color: '#000000', size: 20, x: 430, y: 270 },
    { type: 'circle', color: '#FF69B4', size: 30, x: 400, y: 340 },
    { type: 'rectangle', color: '#8B0000', size: 40, x: 400, y: 360 }
  ]
};

function loadTemplate(templateName) {
  const template = templates[templateName];
  if (!template) return;

  clearCanvas();
  
  template.forEach(shapeData => {
    currentColor = shapeData.color;
    currentSize = shapeData.size;
    currentShape = shapeData.type;
    
    let element;
    switch(shapeData.type) {
      case 'circle':
        element = createCircle(shapeData.x, shapeData.y);
        break;
      case 'square':
        element = createSquare(shapeData.x, shapeData.y);
        break;
      case 'triangle':
        element = createTriangle(shapeData.x, shapeData.y);
        break;
      case 'rectangle':
        element = createRectangle(shapeData.x, shapeData.y);
        break;
      case 'star':
        element = createStar(shapeData.x, shapeData.y);
        break;
      case 'heart':
        element = createHeart(shapeData.x, shapeData.y);
        break;
    }
    
    if (element) {
      document.getElementById('drawing-canvas').appendChild(element);
      shapeHistory.push(shapeData);
    }
  });

  saveDrawingToStorage();
}

// Local Storage Functions
function saveDrawingToStorage() {
  localStorage.setItem('shapeCreatorDrawing', JSON.stringify(shapeHistory));
}

function loadDrawingFromStorage() {
  const saved = localStorage.getItem('shapeCreatorDrawing');
  if (saved) {
    try {
      shapeHistory = JSON.parse(saved);
      redrawCanvas();
    } catch (e) {
      console.log('Could not load saved drawing');
    }
  }
}

// Download function
function downloadDrawing() {
  const canvas = document.getElementById('drawing-canvas');
  const svgData = new XMLSerializer().serializeToString(canvas);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = 'my-shape-creation-' + new Date().getTime() + '.svg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
}

// Navigation function
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#creativity-section';
}
