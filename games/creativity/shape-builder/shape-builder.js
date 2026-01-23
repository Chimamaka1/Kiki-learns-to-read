// Shape Builder Game - Kids drag shapes to complete images
let currentImage = null;
let placedShapes = [];
let draggedShape = null;
const svgNamespace = 'http://www.w3.org/2000/svg';

// Background drawing functions
function drawTreeBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const sky = document.createElementNS(svgNamespace, 'rect');
  sky.setAttribute('x', '0'); sky.setAttribute('y', '0'); sky.setAttribute('width', '800');
  sky.setAttribute('height', '450'); sky.setAttribute('fill', '#ADD8E6');
  g.appendChild(sky);
  const ground = document.createElementNS(svgNamespace, 'rect');
  ground.setAttribute('x', '0'); ground.setAttribute('y', '450'); ground.setAttribute('width', '800');
  ground.setAttribute('height', '150'); ground.setAttribute('fill', '#90EE90');
  g.appendChild(ground);
  const circle = document.createElementNS(svgNamespace, 'circle');
  circle.setAttribute('cx', '400'); circle.setAttribute('cy', '250'); circle.setAttribute('r', '60');
  circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ccc');
  circle.setAttribute('stroke-dasharray', '5,5'); circle.setAttribute('stroke-width', '2');
  g.appendChild(circle);
  const rect = document.createElementNS(svgNamespace, 'rect');
  rect.setAttribute('x', '375'); rect.setAttribute('y', '380'); rect.setAttribute('width', '50');
  rect.setAttribute('height', '60'); rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#ccc');
  rect.setAttribute('stroke-dasharray', '5,5'); rect.setAttribute('stroke-width', '2');
  g.appendChild(rect);
  c.appendChild(g);
}

function drawHouseBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const sky = document.createElementNS(svgNamespace, 'rect');
  sky.setAttribute('x', '0'); sky.setAttribute('y', '0'); sky.setAttribute('width', '800');
  sky.setAttribute('height', '350'); sky.setAttribute('fill', '#87CEEB');
  g.appendChild(sky);
  const ground = document.createElementNS(svgNamespace, 'rect');
  ground.setAttribute('x', '0'); ground.setAttribute('y', '350'); ground.setAttribute('width', '800');
  ground.setAttribute('height', '250'); ground.setAttribute('fill', '#90EE90');
  g.appendChild(ground);
  const tri = document.createElementNS(svgNamespace, 'polygon');
  tri.setAttribute('points', '400,140 340,220 460,220'); tri.setAttribute('fill', 'none');
  tri.setAttribute('stroke', '#ccc'); tri.setAttribute('stroke-dasharray', '5,5'); tri.setAttribute('stroke-width', '2');
  g.appendChild(tri);
  const wall = document.createElementNS(svgNamespace, 'rect');
  wall.setAttribute('x', '325'); wall.setAttribute('y', '310'); wall.setAttribute('width', '150');
  wall.setAttribute('height', '120'); wall.setAttribute('fill', 'none'); wall.setAttribute('stroke', '#ccc');
  wall.setAttribute('stroke-dasharray', '5,5'); wall.setAttribute('stroke-width', '2');
  g.appendChild(wall);
  const door = document.createElementNS(svgNamespace, 'rect');
  door.setAttribute('x', '325'); door.setAttribute('y', '325'); door.setAttribute('width', '50');
  door.setAttribute('height', '50'); door.setAttribute('fill', 'none'); door.setAttribute('stroke', '#ccc');
  door.setAttribute('stroke-dasharray', '5,5'); door.setAttribute('stroke-width', '2');
  g.appendChild(door);
  c.appendChild(g);
}

function drawFlowerBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const sky = document.createElementNS(svgNamespace, 'rect');
  sky.setAttribute('x', '0'); sky.setAttribute('y', '0'); sky.setAttribute('width', '800');
  sky.setAttribute('height', '400'); sky.setAttribute('fill', '#FFE4B5');
  g.appendChild(sky);
  const ground = document.createElementNS(svgNamespace, 'rect');
  ground.setAttribute('x', '0'); ground.setAttribute('y', '400'); ground.setAttribute('width', '800');
  ground.setAttribute('height', '200'); ground.setAttribute('fill', '#90EE90');
  g.appendChild(ground);
  const petals = [
    {cx: 400, cy: 250, r: 25}, {cx: 350, cy: 150, r: 25},
    {cx: 450, cy: 150, r: 25}, {cx: 400, cy: 100, r: 25}
  ];
  petals.forEach(o => {
    const circle = document.createElementNS(svgNamespace, 'circle');
    circle.setAttribute('cx', o.cx); circle.setAttribute('cy', o.cy); circle.setAttribute('r', o.r);
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ccc');
    circle.setAttribute('stroke-dasharray', '5,5'); circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);
  });
  const stem = document.createElementNS(svgNamespace, 'rect');
  stem.setAttribute('x', '375'); stem.setAttribute('y', '360'); stem.setAttribute('width', '50');
  stem.setAttribute('height', '60'); stem.setAttribute('fill', 'none'); stem.setAttribute('stroke', '#ccc');
  stem.setAttribute('stroke-dasharray', '5,5'); stem.setAttribute('stroke-width', '2');
  g.appendChild(stem);
  c.appendChild(g);
}

function drawSunBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const bg = document.createElementNS(svgNamespace, 'rect');
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0'); bg.setAttribute('width', '800');
  bg.setAttribute('height', '600'); bg.setAttribute('fill', '#87CEEB');
  g.appendChild(bg);
  const circle = document.createElementNS(svgNamespace, 'circle');
  circle.setAttribute('cx', '400'); circle.setAttribute('cy', '300'); circle.setAttribute('r', '50');
  circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ccc');
  circle.setAttribute('stroke-dasharray', '5,5'); circle.setAttribute('stroke-width', '2');
  g.appendChild(circle);
  const rays = [
    {x: 400, y: 120, w: 30, h: 60}, {x: 400, y: 420, w: 30, h: 60},
    {x: 280, y: 270, w: 60, h: 30}, {x: 520, y: 270, w: 60, h: 30}
  ];
  rays.forEach(r => {
    const rect = document.createElementNS(svgNamespace, 'rect');
    rect.setAttribute('x', r.x - r.w/2); rect.setAttribute('y', r.y - r.h/2);
    rect.setAttribute('width', r.w); rect.setAttribute('height', r.h);
    rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#ccc');
    rect.setAttribute('stroke-dasharray', '5,5'); rect.setAttribute('stroke-width', '2');
    g.appendChild(rect);
  });
  c.appendChild(g);
}

function drawRobotBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const bg = document.createElementNS(svgNamespace, 'rect');
  bg.setAttribute('x', '0'); bg.setAttribute('y', '0'); bg.setAttribute('width', '800');
  bg.setAttribute('height', '600'); bg.setAttribute('fill', '#e8e8ff');
  g.appendChild(bg);
  const parts = [
    {x: 350, y: 230, w: 100, h: 100},
    {x: 340, y: 370, w: 120, h: 100},
    {x: 290, y: 470, w: 60, h: 60},
    {x: 450, y: 470, w: 60, h: 60}
  ];
  parts.forEach(r => {
    const rect = document.createElementNS(svgNamespace, 'rect');
    rect.setAttribute('x', r.x); rect.setAttribute('y', r.y);
    rect.setAttribute('width', r.w); rect.setAttribute('height', r.h);
    rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#ccc');
    rect.setAttribute('stroke-dasharray', '5,5'); rect.setAttribute('stroke-width', '2');
    g.appendChild(rect);
  });
  c.appendChild(g);
}

function drawCarBackground(c) {
  const g = document.createElementNS(svgNamespace, 'g');
  const sky = document.createElementNS(svgNamespace, 'rect');
  sky.setAttribute('x', '0'); sky.setAttribute('y', '0'); sky.setAttribute('width', '800');
  sky.setAttribute('height', '300'); sky.setAttribute('fill', '#87CEEB');
  g.appendChild(sky);
  const road = document.createElementNS(svgNamespace, 'rect');
  road.setAttribute('x', '0'); road.setAttribute('y', '300'); road.setAttribute('width', '800');
  road.setAttribute('height', '300'); road.setAttribute('fill', '#696969');
  g.appendChild(road);
  const carParts = [
    {x: 330, y: 260, w: 140, h: 80},
    {x: 360, y: 170, w: 80, h: 50}
  ];
  carParts.forEach(r => {
    const rect = document.createElementNS(svgNamespace, 'rect');
    rect.setAttribute('x', r.x); rect.setAttribute('y', r.y);
    rect.setAttribute('width', r.w); rect.setAttribute('height', r.h);
    rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#ccc');
    rect.setAttribute('stroke-dasharray', '5,5'); rect.setAttribute('stroke-width', '2');
    g.appendChild(rect);
  });
  const wheels = [
    {cx: 300, cy: 360, r: 20}, {cx: 500, cy: 360, r: 20}
  ];
  wheels.forEach(o => {
    const circle = document.createElementNS(svgNamespace, 'circle');
    circle.setAttribute('cx', o.cx); circle.setAttribute('cy', o.cy); circle.setAttribute('r', o.r);
    circle.setAttribute('fill', 'none'); circle.setAttribute('stroke', '#ccc');
    circle.setAttribute('stroke-dasharray', '5,5'); circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);
  });
  c.appendChild(g);
}

// Game image templates
const images = {
  tree: {
    name: 'Tree',
    bg: drawTreeBackground,
    shapes: [
      {id: 1, type: 'circle', x: 400, y: 250, size: 120, color: '#228B22', tol: 40},
      {id: 2, type: 'rectangle', x: 400, y: 400, size: 50, color: '#8B4513', tol: 30}
    ]
  },
  house: {
    name: 'House',
    bg: drawHouseBackground,
    shapes: [
      {id: 1, type: 'triangle', x: 400, y: 220, size: 120, color: '#CD5C5C', tol: 40},
      {id: 2, type: 'rectangle', x: 400, y: 380, size: 150, color: '#DEB887', tol: 40},
      {id: 3, type: 'square', x: 350, y: 350, size: 50, color: '#FFD700', tol: 30}
    ]
  },
  flower: {
    name: 'Flower',
    bg: drawFlowerBackground,
    shapes: [
      {id: 1, type: 'circle', x: 400, y: 250, size: 60, color: '#FFD700', tol: 30},
      {id: 2, type: 'circle', x: 350, y: 180, size: 50, color: '#FF69B4', tol: 30},
      {id: 3, type: 'circle', x: 450, y: 180, size: 50, color: '#FF69B4', tol: 30},
      {id: 4, type: 'circle', x: 400, y: 120, size: 50, color: '#FF69B4', tol: 30},
      {id: 5, type: 'rectangle', x: 400, y: 380, size: 30, color: '#228B22', tol: 30}
    ]
  },
  sun: {
    name: 'Sun',
    bg: drawSunBackground,
    shapes: [
      {id: 1, type: 'circle', x: 400, y: 300, size: 100, color: '#FFD700', tol: 40},
      {id: 2, type: 'rectangle', x: 400, y: 120, size: 60, color: '#FFD700', tol: 30},
      {id: 3, type: 'rectangle', x: 400, y: 480, size: 60, color: '#FFD700', tol: 30},
      {id: 4, type: 'rectangle', x: 280, y: 300, size: 60, color: '#FFD700', tol: 30},
      {id: 5, type: 'rectangle', x: 520, y: 300, size: 60, color: '#FFD700', tol: 30}
    ]
  },
  robot: {
    name: 'Robot',
    bg: drawRobotBackground,
    shapes: [
      {id: 1, type: 'square', x: 400, y: 280, size: 100, color: '#C0C0C0', tol: 40},
      {id: 2, type: 'rectangle', x: 400, y: 420, size: 120, color: '#C0C0C0', tol: 40},
      {id: 3, type: 'square', x: 320, y: 500, size: 60, color: '#C0C0C0', tol: 30},
      {id: 4, type: 'square', x: 480, y: 500, size: 60, color: '#C0C0C0', tol: 30}
    ]
  },
  car: {
    name: 'Car',
    bg: drawCarBackground,
    shapes: [
      {id: 1, type: 'rectangle', x: 400, y: 300, size: 140, color: '#FF0000', tol: 40},
      {id: 2, type: 'rectangle', x: 380, y: 200, size: 80, color: '#87CEEB', tol: 30},
      {id: 3, type: 'circle', x: 300, y: 380, size: 40, color: '#000000', tol: 25},
      {id: 4, type: 'circle', x: 500, y: 380, size: 40, color: '#000000', tol: 25}
    ]
  }
};

// Helper to get shape symbol
function getSymbol(t) {
  const symbols = {circle: '●', square: '■', triangle: '▲', rectangle: '▬'};
  return symbols[t] || '●';
}

// Generate shape buttons from array
function genButtons(shapes) {
  const container = document.getElementById('shapes-available');
  container.innerHTML = '';
  shapes.forEach(s => {
    const btn = document.createElement('div');
    btn.className = 'shape-item';
    btn.innerHTML = getSymbol(s.type);
    btn.dataset.shapeId = s.id;
    btn.draggable = true;
    btn.addEventListener('dragstart', e => {
      draggedShape = e.target;
      draggedShape.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    btn.addEventListener('dragend', e => {
      if (draggedShape) draggedShape.classList.remove('dragging');
      draggedShape = null;
    });
    container.appendChild(btn);
  });
}

// Update progress bar
function updateProg() {
  const tmpl = images[currentImage];
  const total = tmpl.shapes.length;
  const placed = placedShapes.length;
  document.getElementById('progress-counter').textContent = placed;
  document.getElementById('total-counter').textContent = total;
  document.getElementById('progress-fill').style.width = (placed / total) * 100 + '%';
}

// Add shape to canvas
function addShape(s) {
  const canvas = document.getElementById('main-canvas');
  let el;
  const sz = s.size;
  switch (s.type) {
    case 'circle':
      el = document.createElementNS(svgNamespace, 'circle');
      el.setAttribute('cx', s.x); el.setAttribute('cy', s.y); el.setAttribute('r', sz/2);
      break;
    case 'square':
      el = document.createElementNS(svgNamespace, 'rect');
      el.setAttribute('x', s.x - sz/2); el.setAttribute('y', s.y - sz/2);
      el.setAttribute('width', sz); el.setAttribute('height', sz); el.setAttribute('rx', '5');
      break;
    case 'triangle':
      el = document.createElementNS(svgNamespace, 'polygon');
      el.setAttribute('points', `${s.x},${s.y - sz/2} ${s.x + sz/2},${s.y + sz/2} ${s.x - sz/2},${s.y + sz/2}`);
      break;
    case 'rectangle':
      el = document.createElementNS(svgNamespace, 'rect');
      el.setAttribute('x', s.x - (sz * 1.5)/2); el.setAttribute('y', s.y - sz/2);
      el.setAttribute('width', sz * 1.5); el.setAttribute('height', sz); el.setAttribute('rx', '5');
      break;
  }
  if (el) {
    el.setAttribute('fill', s.color); el.setAttribute('opacity', '0.85');
    el.setAttribute('stroke', '#333'); el.setAttribute('stroke-width', '2');
    canvas.appendChild(el);
  }
}

// Place shape on canvas
function place(id, x, y) {
  const tmpl = images[currentImage];
  const s = tmpl.shapes.find(sh => sh.id === id);
  if (!s || placedShapes.includes(id)) return;
  const dist = Math.sqrt(Math.pow(x - s.x, 2) + Math.pow(y - s.y, 2));
  if (dist <= s.tol) {
    addShape(s);
    placedShapes.push(id);
    const btn = document.querySelector(`[data-shape-id="${id}"]`);
    if (btn) btn.classList.add('placed');
    updateProg();
    if (placedShapes.length === tmpl.shapes.length) {
      const msg = document.getElementById('completion-message');
      msg.style.display = 'block';
    }
  } else {
    alert('Try closer to the dashed outline!');
  }
}

// Start image
function showImg(name) {
  const tmpl = images[name];
  if (!tmpl) return;
  currentImage = name;
  placedShapes = [];
  const canvas = document.getElementById('main-canvas');
  while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
  tmpl.bg(canvas);
  genButtons(tmpl.shapes);
  updateProg();
  document.querySelectorAll('.image-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[onclick="startImage('${name}')"]`);
  if (btn) btn.classList.add('active');
}

// Next image
function nextImg() {
  const keys = Object.keys(images);
  const idx = keys.indexOf(currentImage);
  showImg(keys[(idx + 1) % keys.length]);
  document.getElementById('completion-message').style.display = 'none';
}

// Go back
function goBack() {
  window.location.href = window.location.href.split('games')[0] + 'index.html#creativity-section';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('main-canvas');
  if (canvas) {
    canvas.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });
    canvas.addEventListener('drop', e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (draggedShape) {
        const id = parseInt(draggedShape.dataset.shapeId);
        place(id, x, y);
      }
    });
  }
  showImg('tree');
});

// Public function for onclick
function startImage(name) {
  showImg(name);
}
