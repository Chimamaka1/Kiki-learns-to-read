class DiceAdventureGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.boardSpaces = 20; // Number of spaces on the board
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
                type: 'count',
                question: 'How many hearts? ❤️❤️❤️❤️❤️',
                answers: ['3', '4', '5', '6'],
                correct: '5'
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
                type: 'count',
                question: 'Count the apples! 🍎🍎',
                answers: ['1', '2', '3', '4'],
                correct: '2'
            },
            {
                type: 'size',
                question: 'Which is bigger? 🐘 vs 🐭',
                answers: ['Elephant', 'Mouse', 'Same', 'Not sure'],
                correct: 'Elephant'
            }
        ];
        
        this.characterData = [
            { emoji: '🦁', name: 'Lion', color: '#ff6b6b' },
            { emoji: '🐘', name: 'Elephant', color: '#4ecdc4' },
            { emoji: '🐸', name: 'Frog', color: '#51cf66' },
            { emoji: '🐻', name: 'Bear', color: '#ffd93d' }
        ];
        
        this.specialSpaces = [5, 10, 15]; // Task spaces
        this.bonusSpaces = [7, 14]; // Skip ahead spaces
        this.penaltySpaces = [3, 12, 18]; // Go back spaces
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('rollDice').addEventListener('click', () => this.rollDice());
        document.getElementById('taskDone').addEventListener('click', () => this.closeTask());
        document.getElementById('playAgain').addEventListener('click', () => this.resetGame());
        document.getElementById('backBtn').addEventListener('click', () => {
            window.location.href = '../../../index.html';
        });
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
                line.setAttribute('stroke', '#666');
                line.setAttribute('stroke-width', '8');
                line.setAttribute('stroke-dasharray', '10,5');
                board.appendChild(line);
            }
            
            // Draw space
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', coord.x);
            circle.setAttribute('cy', coord.y);
            circle.setAttribute('r', '30');
            circle.classList.add('board-space');
            circle.setAttribute('data-space', index);
            
            // Color based on space type
            if (index === 0) {
                circle.setAttribute('fill', '#51cf66'); // Start
            } else if (index === this.boardSpaces) {
                circle.setAttribute('fill', '#ffd93d'); // Finish
            } else if (this.specialSpaces.includes(index)) {
                circle.setAttribute('fill', '#ff6b6b'); // Task
            } else if (this.bonusSpaces.includes(index)) {
                circle.setAttribute('fill', '#4ecdc4'); // Bonus
            } else if (this.penaltySpaces.includes(index)) {
                circle.setAttribute('fill', '#ff8787'); // Penalty
            } else {
                circle.setAttribute('fill', '#f8f9fa'); // Regular
            }
            
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', '3');
            board.appendChild(circle);
            
            // Add number
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', coord.x);
            text.setAttribute('y', coord.y + 6);
            text.setAttribute('text-anchor', 'middle');
            text.classList.add('space-number');
            text.textContent = index;
            board.appendChild(text);
            
            // Add icon for special spaces
            if (index === 0) {
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', coord.x);
                icon.setAttribute('y', coord.y - 45);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '30');
                icon.textContent = '🏁';
                board.appendChild(icon);
            } else if (index === this.boardSpaces) {
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', coord.x);
                icon.setAttribute('y', coord.y - 45);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '30');
                icon.textContent = '🏆';
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
        const spacesPerRow = 5;
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
            const offset = (index - this.players.length / 2) * 25; // Offset players on same space
            
            const token = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            token.setAttribute('x', coord.x + offset);
            token.setAttribute('y', coord.y + 15);
            token.setAttribute('text-anchor', 'middle');
            token.classList.add('player-token');
            token.textContent = player.emoji;
            token.setAttribute('data-player', player.id);
            
            board.appendChild(token);
        });
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
                
                this.movePlayer(finalRoll);
            }
        }, 100);
    }
    
    async movePlayer(steps) {
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
                taskContent.innerHTML = `<div style="font-size: 3em;">🎉 Correct! Move forward 1 space! 🎉</div>`;
                player.position = Math.min(player.position + 1, this.boardSpaces);
                this.updatePlayerPositions();
                this.updatePlayersDisplay();
                document.getElementById('taskDone').style.display = 'block';
            }, 1000);
        } else {
            button.classList.add('wrong');
            
            setTimeout(() => {
                const taskContent = document.getElementById('taskContent');
                taskContent.innerHTML = `<div style="font-size: 2em;">😅 Oops! The answer was: ${correct}</div>`;
                document.getElementById('taskDone').style.display = 'block';
            }, 1000);
        }
    }
    
    showBonus() {
        const player = this.players[this.currentPlayerIndex];
        
        document.getElementById('taskTitle').textContent = '✨ Lucky Space! ✨';
        document.getElementById('taskContent').innerHTML = `
            <div style="font-size: 3em;">🎁 Jump forward 2 spaces! 🎁</div>
        `;
        document.getElementById('taskModal').classList.remove('hidden');
        document.getElementById('taskDone').style.display = 'block';
        
        player.position = Math.min(player.position + 2, this.boardSpaces);
        this.updatePlayerPositions();
        this.updatePlayersDisplay();
    }
    
    showPenalty() {
        const player = this.players[this.currentPlayerIndex];
        
        document.getElementById('taskTitle').textContent = '😮 Oops!';
        document.getElementById('taskContent').innerHTML = `
            <div style="font-size: 3em;">🌀 Go back 1 space! 🌀</div>
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
        document.getElementById('rollDice').disabled = false;
    }
    
    resetGame() {
        document.getElementById('winModal').classList.add('hidden');
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('setupScreen').classList.remove('hidden');
        
        this.players = [];
        this.currentPlayerIndex = 0;
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new DiceAdventureGame();
});
