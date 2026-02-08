class DiceAdventureGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.boardSpaces = 35; // Longer board!
        this.remainingSteps = 0;
        this.isManualMove = false;
        this.activeDragPlayerId = null;
        this.dragState = {
            active: false,
            offsetX: 0,
            offsetY: 0,
            lastPoint: null
        };
        this.tasks = [
            {
                type: 'count',
                question: 'Count the stars! ⭐⭐⭐',
                answers: ['1', '2', '3', '4'],
                correct: '3'
            },
            {
                type: 'color',
                question: 'What color is this? 🔴',
                answers: ['Red', 'Blue', 'Green', 'Yellow'],
                correct: 'Red'
            },
            {
                type: 'color',
                question: 'What color is this? 🔵',
                answers: ['Red', 'Blue', 'Green', 'Yellow'],
                correct: 'Blue'
            },
            {
                type: 'color',
                question: 'What color is this? 🟢',
                answers: ['Red', 'Blue', 'Green', 'Yellow'],
                correct: 'Green'
            },
            {
                type: 'color',
                question: 'What color is this? 🟡',
                answers: ['Red', 'Blue', 'Green', 'Yellow'],
                correct: 'Yellow'
            },
            {
                type: 'shape',
                question: 'What shape is this? ⭕',
                answers: ['Circle', 'Square', 'Triangle', 'Star'],
                correct: 'Circle'
            },
            {
                type: 'shape',
                question: 'What shape is this? ⬛',
                answers: ['Circle', 'Square', 'Triangle', 'Star'],
                correct: 'Square'
            },
            {
                type: 'shape',
                question: 'What shape is this? 🔺',
                answers: ['Circle', 'Square', 'Triangle', 'Star'],
                correct: 'Triangle'
            },
            {
                type: 'count',
                question: 'How many hearts? ❤️❤️❤️❤️❤️',
                answers: ['3', '4', '5', '6'],
                correct: '5'
            },
            {
                type: 'count',
                question: 'Count the flowers! 🌸🌸🌸🌸',
                answers: ['2', '3', '4', '5'],
                correct: '4'
            },
            {
                type: 'animal',
                question: 'What sound does a cat make?',
                answers: ['Woof', 'Meow', 'Moo', 'Quack'],
                correct: 'Meow'
            },
            {
                type: 'animal',
                question: 'What sound does a dog make?',
                answers: ['Woof', 'Meow', 'Moo', 'Quack'],
                correct: 'Woof'
            },
            {
                type: 'animal',
                question: 'What sound does a cow make?',
                answers: ['Woof', 'Meow', 'Moo', 'Quack'],
                correct: 'Moo'
            },
            {
                type: 'animal',
                question: 'What sound does a duck make?',
                answers: ['Woof', 'Meow', 'Moo', 'Quack'],
                correct: 'Quack'
            },
            {
                type: 'count',
                question: 'Count the apples! 🍎🍎',
                answers: ['1', '2', '3', '4'],
                correct: '2'
            },
            {
                type: 'count',
                question: 'How many balloons? 🎈🎈🎈🎈🎈🎈',
                answers: ['4', '5', '6', '7'],
                correct: '6'
            },
            {
                type: 'size',
                question: 'Which is bigger? 🐘 vs 🐭',
                answers: ['Elephant', 'Mouse', 'Same', 'Not sure'],
                correct: 'Elephant'
            },
            {
                type: 'action',
                question: 'Can you jump 3 times? 🤸',
                answers: ['Yes! (Jump 3 times)', 'Done!', 'Ready!', 'I did it!'],
                correct: 'Yes! (Jump 3 times)'
            },
            {
                type: 'action',
                question: 'Can you clap your hands 5 times? 👏',
                answers: ['Yes! (Clap 5 times)', 'Done!', 'Ready!', 'I did it!'],
                correct: 'Yes! (Clap 5 times)'
            },
            {
                type: 'action',
                question: 'Touch your nose! 👃',
                answers: ['Done!', 'I did it!', 'Ready!', 'Yes!'],
                correct: 'Done!'
            },
            {
                type: 'rhyme',
                question: 'What rhymes with CAT? 🐱',
                answers: ['Hat', 'Dog', 'Sun', 'Car'],
                correct: 'Hat'
            },
            {
                type: 'opposite',
                question: 'What\'s the opposite of BIG?',
                answers: ['Small', 'Large', 'Huge', 'Tall'],
                correct: 'Small'
            },
            {
                type: 'opposite',
                question: 'What\'s the opposite of HOT? 🔥',
                answers: ['Warm', 'Cold', 'Cool', 'Freezing'],
                correct: 'Cold'
            }
        ];
        
        this.characterData = [
            { emoji: '🦁', name: 'Lion', color: '#ff6b6b' },
            { emoji: '🐘', name: 'Elephant', color: '#4ecdc4' },
            { emoji: '🐸', name: 'Frog', color: '#51cf66' },
            { emoji: '🐻', name: 'Bear', color: '#ffd93d' }
        ];
        
        this.specialSpaces = [5, 10, 15, 20, 25, 30]; // More task spaces
        this.bonusSpaces = [7, 14, 22, 28]; // More bonus spaces
        this.penaltySpaces = [3, 12, 18, 24, 32]; // More penalty spaces
        this.superBonusSpaces = [17, 27]; // Extra special spaces
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDragSurface();
    }
    
    setupEventListeners() {
        const startBtn = document.getElementById('startGame');
        const rollBtn = document.getElementById('rollDice');

        startBtn.addEventListener('click', () => this.startGame());
        rollBtn.addEventListener('click', () => this.rollDice());

        // iPad Safari touch support
        startBtn.addEventListener('touchstart', (evt) => {
            evt.preventDefault();
            this.startGame();
        }, { passive: false });
        rollBtn.addEventListener('touchstart', (evt) => {
            evt.preventDefault();
            this.rollDice();
        }, { passive: false });
        document.getElementById('taskDone').addEventListener('click', () => this.closeTask());
        document.getElementById('playAgain').addEventListener('click', () => this.resetGame());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = '../../../index.html';
        });
    }

    setupDragSurface() {
        if (this.dragSurfaceBound) return;
        const svg = document.getElementById('gameBoard');
        if (!svg) return;

        this.dragSurfaceBound = true;

        svg.addEventListener('pointerdown', (evt) => this.handleBoardPointerDown(evt), { passive: false });
        svg.addEventListener('pointermove', (evt) => this.handleBoardPointerMove(evt), { passive: false });
        window.addEventListener('pointerup', (evt) => this.handleBoardPointerUp(evt), { passive: false });
        svg.addEventListener('pointerleave', (evt) => this.handleBoardPointerUp(evt), { passive: false });

        // Touch support for iPad Safari
        svg.addEventListener('touchstart', (evt) => this.handleBoardPointerDown(evt), { passive: false });
        svg.addEventListener('touchmove', (evt) => this.handleBoardPointerMove(evt), { passive: false });
        window.addEventListener('touchend', (evt) => this.handleBoardPointerUp(evt), { passive: false });
        window.addEventListener('touchcancel', (evt) => this.handleBoardPointerUp(evt), { passive: false });
    }
    
    startGame() {
        // Get selected players
        const selectedPlayers = [];
        this.characterData.forEach((char, index) => {
            const checkbox = document.getElementById(`player${index + 1}`);
            if (checkbox.checked) {
                selectedPlayers.push({
                    ...char,
                    position: 0,
                    id: index
                });
            }
        });
        
        if (selectedPlayers.length < 2) {
            alert('Please select at least 2 players! 👥');
            return;
        }
        
        this.players = selectedPlayers;
        this.currentPlayerIndex = 0;
        
        // Hide setup, show game
        document.getElementById('setupScreen').classList.add('hidden');
        document.getElementById('gameScreen').classList.remove('hidden');
        
        this.createBoard();
        this.updatePlayersDisplay();
        this.updateCurrentPlayer();
    }
    
    createBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';
        
        // Create path coordinates
        const pathCoords = this.generatePathCoordinates();
        
        // Draw path
        pathCoords.forEach((coord, index) => {
            // Draw connecting line
            if (index > 0) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', pathCoords[index - 1].x);
                line.setAttribute('y1', pathCoords[index - 1].y);
                line.setAttribute('x2', coord.x);
                line.setAttribute('y2', coord.y);
                line.setAttribute('stroke', '#8B4513');
                line.setAttribute('stroke-width', '10');
                line.setAttribute('stroke-dasharray', '15,10');
                line.setAttribute('opacity', '0.6');
                board.appendChild(line);
            }
            
            // Draw space
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', coord.x);
            circle.setAttribute('cy', coord.y);
            circle.setAttribute('r', '35');
            circle.classList.add('board-space');
            circle.setAttribute('data-space', index);
            
            // Color based on space type
            if (index === 0) {
                circle.setAttribute('fill', '#51cf66'); // Start
            } else if (index === this.boardSpaces) {
                circle.setAttribute('fill', '#ffd93d'); // Finish
            } else if (this.superBonusSpaces && this.superBonusSpaces.includes(index)) {
                circle.setAttribute('fill', '#a29bfe'); // Super bonus
                circle.classList.add('special');
            } else if (this.specialSpaces.includes(index)) {
                circle.setAttribute('fill', '#ff6b6b'); // Task
                circle.classList.add('special');
            } else if (this.bonusSpaces.includes(index)) {
                circle.setAttribute('fill', '#4ecdc4'); // Bonus
                circle.classList.add('special');
            } else if (this.penaltySpaces.includes(index)) {
                circle.setAttribute('fill', '#ff8787'); // Penalty
            } else {
                circle.setAttribute('fill', '#ffffff'); // Regular
            }
            
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '4');
            
            // Store space index
            circle.spaceIndex = index;

            // Click-to-move fallback (also helps on touch)
            circle.addEventListener('click', () => this.handleSpaceClick(index));
            circle.addEventListener('touchstart', (evt) => {
                evt.preventDefault();
                this.handleSpaceClick(index);
            }, { passive: false });
            
            board.appendChild(circle);
            
            // Add number
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', coord.x);
            text.setAttribute('y', coord.y + 8);
            text.setAttribute('text-anchor', 'middle');
            text.classList.add('space-number');
            text.textContent = index;
            board.appendChild(text);
            
            // Add icon for special spaces
            if (index === 0) {
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', coord.x);
                icon.setAttribute('y', coord.y - 50);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '35');
                icon.textContent = '🏁';
                board.appendChild(icon);
            } else if (index === this.boardSpaces) {
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', coord.x);
                icon.setAttribute('y', coord.y - 50);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '35');
                icon.textContent = '🏆';
                board.appendChild(icon);
            } else if (this.superBonusSpaces && this.superBonusSpaces.includes(index)) {
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', coord.x);
                icon.setAttribute('y', coord.y - 50);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '25');
                icon.textContent = '✨';
                board.appendChild(icon);
            }
        });
        
        this.pathCoords = pathCoords;
        this.updatePlayerPositions();
    }
    
    generatePathCoordinates() {
        const coords = [];
        const margin = 80;
        const width = 1000 - 2 * margin;
        const height = 600 - 2 * margin;
        
        // Create a winding path
        const spacesPerRow = 6;
        const rows = Math.ceil((this.boardSpaces + 1) / spacesPerRow);
        const xSpacing = width / (spacesPerRow - 1);
        const ySpacing = height / (rows - 1);
        
        for (let i = 0; i <= this.boardSpaces; i++) {
            const row = Math.floor(i / spacesPerRow);
            const col = i % spacesPerRow;
            
            let x, y;
            
            if (row % 2 === 0) {
                // Left to right
                x = margin + col * xSpacing;
            } else {
                // Right to left
                x = margin + (spacesPerRow - 1 - col) * xSpacing;
            }
            
            y = margin + row * ySpacing;
            
            coords.push({ x, y });
        }
        
        return coords;
    }
    
    updatePlayerPositions() {
        // Remove existing tokens
        const existingTokens = document.querySelectorAll('.player-token');
        existingTokens.forEach(token => token.remove());
        
        const board = document.getElementById('gameBoard');
        
        this.players.forEach((player, index) => {
            const coord = this.pathCoords[player.position];
            const offset = (index - this.players.length / 2) * 30;
            
            const token = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            token.setAttribute('x', coord.x + offset);
            token.setAttribute('y', coord.y + 18);
            token.setAttribute('text-anchor', 'middle');
            token.classList.add('player-token');
            token.textContent = player.emoji;
            token.setAttribute('data-player', player.id);
            token.setAttribute('data-original-x', coord.x + offset);
            token.setAttribute('data-original-y', coord.y + 18);
            
            // Make current player's token draggable
            if (this.isManualMove && index === this.currentPlayerIndex) {
                token.classList.add('draggable');
                this.activeDragPlayerId = player.id;
            }
            
            board.appendChild(token);
        });
    }

    getEventPoint(evt) {
        const svg = document.getElementById('gameBoard');
        const touch = (evt.touches && evt.touches[0]) || (evt.changedTouches && evt.changedTouches[0]);
        const clientX = evt.clientX ?? touch?.clientX;
        const clientY = evt.clientY ?? touch?.clientY;

        if (clientX == null || clientY == null) return null;

        const rect = svg.getBoundingClientRect();
        const viewBox = svg.viewBox.baseVal;

        const x = ((clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
        const y = ((clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;

        return { x, y };
    }

    getPlayerTokenPosition(player) {
        const index = this.players.findIndex(p => p.id === player.id);
        const coord = this.pathCoords[player.position];
        const offset = (index - this.players.length / 2) * 30;
        return { x: coord.x + offset, y: coord.y + 18 };
    }

    handleBoardPointerDown(evt) {
        if (!this.isManualMove || this.remainingSteps <= 0) return;
        const player = this.players[this.currentPlayerIndex];
        if (!player) return;

        const point = this.getEventPoint(evt);
        if (!point) return;
        const tokenPos = this.getPlayerTokenPosition(player);
        const distance = Math.sqrt(Math.pow(point.x - tokenPos.x, 2) + Math.pow(point.y - tokenPos.y, 2));

        // Start drag if near the current player's token
        if (distance <= 50) {
            evt.preventDefault();
            this.dragState.active = true;
            this.dragState.offsetX = point.x - tokenPos.x;
            this.dragState.offsetY = point.y - tokenPos.y;

            const token = document.querySelector(`.player-token[data-player='${player.id}']`);
            if (token) {
                token.classList.add('dragging');
                token.style.zIndex = '1000';
            }
        }
    }

    handleBoardPointerMove(evt) {
        if (!this.dragState.active) return;
        evt.preventDefault();

        const player = this.players[this.currentPlayerIndex];
        if (!player) return;

        const point = this.getEventPoint(evt);
        if (!point) return;
        this.dragState.lastPoint = point;
        const token = document.querySelector(`.player-token[data-player='${player.id}']`);
        if (token) {
            token.setAttribute('x', point.x - this.dragState.offsetX);
            token.setAttribute('y', point.y - this.dragState.offsetY);
        }
    }

    handleBoardPointerUp(evt) {
        if (!this.dragState.active) return;
        evt.preventDefault();
        this.dragState.active = false;

        const player = this.players[this.currentPlayerIndex];
        if (!player) return;

        const point = this.getEventPoint(evt) || this.dragState.lastPoint;
        if (!point) return;
        const droppedSpace = this.findSpaceAtCoordinates(point.x, point.y);
        const validSpace = player.position + 1;

        const token = document.querySelector(`.player-token[data-player='${player.id}']`);
        if (token) {
            token.classList.remove('dragging');
            token.style.zIndex = '';
        }

        if (droppedSpace === validSpace && this.remainingSteps > 0) {
            this.handleSuccessfulDrop(player, droppedSpace);
        } else if (token) {
            token.setAttribute('x', token.getAttribute('data-original-x'));
            token.setAttribute('y', token.getAttribute('data-original-y'));
        }
    }

    async handleSpaceClick(spaceIndex) {
        if (!this.isManualMove || this.remainingSteps <= 0) return;

        const player = this.players[this.currentPlayerIndex];

        // Only allow next space
        if (spaceIndex !== player.position + 1) return;

        player.position = spaceIndex;
        this.updatePlayerPositions();
        await this.sleep(200);

        this.remainingSteps--;
        document.getElementById('stepsRemaining').textContent = this.remainingSteps;

        if (this.remainingSteps === 0 || player.position === this.boardSpaces) {
            this.isManualMove = false;
            document.getElementById('moveInstruction').classList.add('hidden');
            this.clearDropZones();
            this.updatePlayerPositions();
            this.updatePlayersDisplay();

            if (player.position === this.boardSpaces) {
                this.showWinner(player);
            } else if (this.specialSpaces.includes(player.position)) {
                this.showTask();
            } else if (this.superBonusSpaces && this.superBonusSpaces.includes(player.position)) {
                this.showSuperBonus();
            } else if (this.bonusSpaces.includes(player.position)) {
                this.showBonus();
            } else if (this.penaltySpaces.includes(player.position)) {
                this.showPenalty();
            } else {
                this.nextTurn();
            }
        } else {
            this.highlightDropZones();
        }
    }
    
    updatePlayersDisplay() {
        const list = document.getElementById('playersList');
        list.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const card = document.createElement('div');
            card.className = 'player-card';
            if (index === this.currentPlayerIndex) {
                card.classList.add('active');
            }
            
            card.innerHTML = `
                <div class="emoji">${player.emoji}</div>
                <div class="info">
                    <div class="name">${player.name}</div>
                    <div class="position">Space: ${player.position}/${this.boardSpaces}</div>
                </div>
            `;
            
            list.appendChild(card);
        });
    }
    
    updateCurrentPlayer() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        document.getElementById('currentPlayer').textContent = `${currentPlayer.emoji} ${currentPlayer.name}`;
    }
    
    rollDice() {
        const diceBtn = document.getElementById('rollDice');
        diceBtn.disabled = true;
        
        const diceElement = document.getElementById('dice');
        diceElement.classList.add('rolling');
        
        // Animate rolling
        let rolls = 0;
        const rollInterval = setInterval(() => {
            diceElement.textContent = Math.floor(Math.random() * 6) + 1;
            rolls++;
            
            if (rolls >= 10) {
                clearInterval(rollInterval);
                const finalRoll = Math.floor(Math.random() * 6) + 1;
                diceElement.textContent = finalRoll;
                diceElement.classList.remove('rolling');
                
                // Enable manual movement
                this.remainingSteps = finalRoll;
                this.isManualMove = true;
                
                // Show instruction
                const instruction = document.getElementById('moveInstruction');
                const stepsText = document.getElementById('stepsRemaining');
                stepsText.textContent = this.remainingSteps;
                instruction.classList.remove('hidden');
                
                // Highlight the next space to click
                this.highlightDropZones();
            }
        }, 100);
    }
    
    attachDragHandlers() {
        // Drag handling now done on the board surface for iPad reliability.
    }
    
    findSpaceAtCoordinates(x, y) {
        for (let i = 0; i < this.pathCoords.length; i++) {
            const coord = this.pathCoords[i];
            const distance = Math.sqrt(Math.pow(x - coord.x, 2) + Math.pow(y - coord.y, 2));
            if (distance <= 40) { // Within 40 units of the space center
                return i;
            }
        }
        return null;
    }
    
    async handleSuccessfulDrop(player, spaceIndex) {
        player.position = spaceIndex;
        
        this.updatePlayerPositions();
        await this.sleep(300);
        
        this.remainingSteps--;
        document.getElementById('stepsRemaining').textContent = this.remainingSteps;
        
        // Check if movement is complete
        if (this.remainingSteps === 0 || player.position === this.boardSpaces) {
            this.isManualMove = false;
            document.getElementById('moveInstruction').classList.add('hidden');
            this.clearDropZones();
            this.updatePlayerPositions();
            this.updatePlayersDisplay();
            
            // Check for special space
            if (player.position === this.boardSpaces) {
                this.showWinner(player);
            } else if (this.specialSpaces.includes(player.position)) {
                this.showTask();
            } else if (this.superBonusSpaces && this.superBonusSpaces.includes(player.position)) {
                this.showSuperBonus();
            } else if (this.bonusSpaces.includes(player.position)) {
                this.showBonus();
            } else if (this.penaltySpaces.includes(player.position)) {
                this.showPenalty();
            } else {
                this.nextTurn();
            }
        } else {
            // Update which space is highlighted
            this.highlightDropZones();
        }
    }
    
    highlightDropZones() {
        const player = this.players[this.currentPlayerIndex];
        const nextSpace = player.position + 1;
        
        // Clear previous highlights
        this.clearDropZones();
        
        // Highlight next valid space
        if (this.isManualMove && nextSpace <= this.boardSpaces) {
            const spaces = document.querySelectorAll('.board-space');
            spaces.forEach(space => {
                if (space.spaceIndex === nextSpace) {
                    space.classList.add('drop-zone');
                }
            });
        }
    }

    clearDropZones() {
        const spaces = document.querySelectorAll('.board-space');
        spaces.forEach(space => space.classList.remove('drop-zone'));
    }
    
    async movePlayer(steps) {
        // This method is kept for compatibility but now we use manual movement
        const player = this.players[this.currentPlayerIndex];
        const newPosition = Math.min(player.position + steps, this.boardSpaces);
        
        // Animate movement
        for (let i = player.position + 1; i <= newPosition; i++) {
            player.position = i;
            this.updatePlayerPositions();
            await this.sleep(300);
        }
        
        this.updatePlayersDisplay();
        
        // Check for special space
        if (player.position === this.boardSpaces) {
            this.showWinner(player);
        } else if (this.specialSpaces.includes(player.position)) {
            this.showTask();
        } else if (this.bonusSpaces.includes(player.position)) {
            this.showBonus();
        } else if (this.penaltySpaces.includes(player.position)) {
            this.showPenalty();
        } else {
            this.nextTurn();
        }
    }
    
    showTask() {
        // Hide instruction and stop manual mode
        document.getElementById('moveInstruction').classList.add('hidden');
        this.remainingSteps = 0;
        this.isManualMove = false;
        
        const task = this.tasks[Math.floor(Math.random() * this.tasks.length)];
        
        document.getElementById('taskTitle').textContent = '🎯 Answer this!';
        
        const taskContent = document.getElementById('taskContent');
        taskContent.innerHTML = `
            <div>${task.question}</div>
            <div class="task-options"></div>
        `;
        
        const optionsContainer = taskContent.querySelector('.task-options');
        
        task.answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.className = 'task-option';
            btn.textContent = answer;
            btn.addEventListener('click', () => this.checkAnswer(btn, answer, task.correct));
            optionsContainer.appendChild(btn);
        });
        
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskDone').style.display = 'none';
    }
    
    checkAnswer(button, answer, correct) {
        const allButtons = document.querySelectorAll('.task-option');
        allButtons.forEach(btn => btn.disabled = true);
        
        if (answer === correct) {
            button.classList.add('correct');
            const player = this.players[this.currentPlayerIndex];
            
            // Bonus: move forward 1 space
            setTimeout(() => {
                const taskContent = document.getElementById('taskContent');
                taskContent.innerHTML = `<div class="task-message">🎉 Correct! Move forward 1 space! 🎉</div>`;
                player.position = Math.min(player.position + 1, this.boardSpaces);
                this.updatePlayerPositions();
                this.updatePlayersDisplay();
                
                // Hide instruction if showing
                document.getElementById('moveInstruction').classList.add('hidden');
                this.remainingSteps = 0;
                this.isManualMove = false;
                
                document.getElementById('taskDone').style.display = 'block';
            }, 1000);
        } else {
            button.classList.add('wrong');
            
            setTimeout(() => {
                const taskContent = document.getElementById('taskContent');
                taskContent.innerHTML = `<div class="task-message">😅 Oops! The answer was: ${correct}</div>`;
                
                // Hide instruction if showing
                document.getElementById('moveInstruction').classList.add('hidden');
                this.remainingSteps = 0;
                this.isManualMove = false;
                
                document.getElementById('taskDone').style.display = 'block';
            }, 1000);
        }
    }
    
    showBonus() {
        const player = this.players[this.currentPlayerIndex];
        
        // Hide instruction and stop manual mode
        document.getElementById('moveInstruction').classList.add('hidden');
        this.remainingSteps = 0;
        this.isManualMove = false;
        
        document.getElementById('taskTitle').textContent = '✨ Lucky Space! ✨';
        document.getElementById('taskContent').innerHTML = `
            <div class="task-message">🎁 Jump forward 2 spaces! 🎁</div>
        `;
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskDone').style.display = 'block';
        
        player.position = Math.min(player.position + 2, this.boardSpaces);
        this.updatePlayerPositions();
        this.updatePlayersDisplay();
    }
    
    showSuperBonus() {
        const player = this.players[this.currentPlayerIndex];
        
        // Hide instruction and stop manual mode
        document.getElementById('moveInstruction').classList.add('hidden');
        this.remainingSteps = 0;
        this.isManualMove = false;
        
        document.getElementById('taskTitle').textContent = '🌟 SUPER LUCKY! 🌟';
        document.getElementById('taskContent').innerHTML = `
            <div class="task-message">🚀 ZOOM forward 3 spaces! 🚀</div>
        `;
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskDone').style.display = 'block';
        
        player.position = Math.min(player.position + 3, this.boardSpaces);
        this.updatePlayerPositions();
        this.updatePlayersDisplay();
    }
    
    showPenalty() {
        const player = this.players[this.currentPlayerIndex];
        
        // Hide instruction and stop manual mode
        document.getElementById('moveInstruction').classList.add('hidden');
        this.remainingSteps = 0;
        this.isManualMove = false;
        
        document.getElementById('taskTitle').textContent = '😮 Oops!';
        document.getElementById('taskContent').innerHTML = `
            <div class="task-message">🌀 Go back 1 space! 🌀</div>
        `;
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskDone').style.display = 'block';
        
        player.position = Math.max(player.position - 1, 0);
        this.updatePlayerPositions();
        this.updatePlayersDisplay();
    }
    
    closeTask() {
        document.getElementById('taskModal').classList.add('hidden');
        
        const player = this.players[this.currentPlayerIndex];
        this.clearDropZones();
        
        if (player.position === this.boardSpaces) {
            this.showWinner(player);
        } else {
            this.nextTurn();
        }
    }
    
    showWinner(player) {
        document.getElementById('winnerInfo').textContent = `${player.emoji} ${player.name} wins!`;
        document.getElementById('winModal').classList.remove('hidden');
        
        // Confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const confettiEmojis = ['🎉', '🎊', '⭐', '✨', '🎈', '🎁'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-50px';
                confetti.style.fontSize = '2em';
                confetti.style.zIndex = '10000';
                confetti.style.animation = `fall ${2 + Math.random() * 3}s linear`;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 5000);
            }, i * 100);
        }
        
        // Add CSS animation
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes fall {
                    to { transform: translateY(100vh) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.updateCurrentPlayer();
        this.updatePlayersDisplay();
        this.remainingSteps = 0;
        this.isManualMove = false;
        this.clearDropZones();
        document.getElementById('moveInstruction').classList.add('hidden');
        document.getElementById('rollDice').disabled = false;
    }
    
    resetGame() {
        document.getElementById('winModal').classList.add('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('setupScreen').classList.remove('hidden');
        document.getElementById('moveInstruction').classList.add('hidden');
        
        this.players = [];
        this.currentPlayerIndex = 0;
        this.remainingSteps = 0;
        this.isManualMove = false;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DiceAdventureGame();
});
