class Game2048 {
    constructor(container) {
        this.container = container;
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.init();
    }

    init() {
        this.createGrid();
        this.addNumber();
        this.addNumber();
        this.bindEvents();
        this.updateGrid();
    }

    createGrid() {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                fragment.appendChild(cell);
            }
        }
        this.container.appendChild(fragment);
    }

    addNumber() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateGrid() {
        const cells = this.container.getElementsByClassName('grid-cell');
        for (let i = 0; i < cells.length; i++) {
            const row = parseInt(cells[i].getAttribute('data-row'));
            const col = parseInt(cells[i].getAttribute('data-col'));
            const value = this.grid[row][col];
            cells[i].textContent = value || '';
            cells[i].className = `grid-cell tile-${value}`;
        }
        document.getElementById('game-score').textContent = this.score;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const moved = this.move(e.key);
                if (moved) {
                    this.addNumber();
                    this.updateGrid();
                    if (this.isGameOver()) {
                        alert('游戏结束！得分：' + this.score);
                    }
                }
            }
        });

        // 添加触摸支持
        let touchStartX, touchStartY;
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.container.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) this.move('ArrowRight');
                else this.move('ArrowLeft');
            } else {
                if (dy > 0) this.move('ArrowDown');
                else this.move('ArrowUp');
            }

            this.addNumber();
            this.updateGrid();
            if (this.isGameOver()) {
                alert('游戏结束！得分：' + this.score);
            }
        });
    }

    move(direction) {
        let moved = false;
        const newGrid = JSON.parse(JSON.stringify(this.grid));

        switch (direction) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(x => x !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            const newRow = row.concat(Array(4 - row.length).fill(0));
            if (newRow.join(',') !== this.grid[i].join(',')) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            const row = this.grid[i].filter(x => x !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            const newRow = Array(4 - row.length).fill(0).concat(row);
            if (newRow.join(',') !== this.grid[i].join(',')) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const column = this.grid.map(row => row[j]).filter(x => x !== 0);
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            const newColumn = column.concat(Array(4 - column.length).fill(0));
            if (newColumn.some((val, idx) => val !== this.grid[idx][j])) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            const column = this.grid.map(row => row[j]).filter(x => x !== 0);
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                }
            }
            const newColumn = Array(4 - column.length).fill(0).concat(column);
            if (newColumn.some((val, idx) => val !== this.grid[idx][j])) {
                moved = true;
            }
            for (let i = 0; i < 4; i++) {
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // 检查是否有相邻的相同数字
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (j < 3 && this.grid[i][j] === this.grid[i][j + 1]) return false;
                if (i < 3 && this.grid[i][j] === this.grid[i + 1][j]) return false;
            }
        }

        return true;
    }
} 