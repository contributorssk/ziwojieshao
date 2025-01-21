class SnakeGame {
    constructor(container) {
        this.container = container;
        this.gridSize = 20;
        this.tileCount = 20;
        this.tileSize = container.clientWidth / this.tileCount;
        this.snake = [{x: 10, y: 10}];
        this.food = {x: 15, y: 15};
        this.dx = 1; // 设置初始移动方向向右
        this.dy = 0;
        this.score = 0;
        this.gameLoop = null;
        this.canvas = null;
        this.ctx = null;
        this.gameStarted = false; // 添加游戏开始标志
        this.init();
    }

    init() {
        // 创建画布
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientWidth;
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // 绑定键盘事件
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // 添加触摸控制
        this.addTouchControls();

        // 绘制初始状态
        this.draw();

        // 显示开始提示
        this.showStartMessage();
    }

    showStartMessage() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('按任意方向键开始游戏', this.canvas.width / 2, this.canvas.height / 2);
    }

    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.gameLoop = setInterval(this.update.bind(this), 150); // 降低游戏速度
        }
    }

    addTouchControls() {
        let touchStartX = 0;
        let touchStartY = 0;

        this.canvas.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('touchend', (e) => {
            if (!this.gameStarted) {
                this.startGame();
            }

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平移动
                if (dx > 0 && this.dx === 0) { this.setDirection(1, 0); }
                else if (dx < 0 && this.dx === 0) { this.setDirection(-1, 0); }
            } else {
                // 垂直移动
                if (dy > 0 && this.dy === 0) { this.setDirection(0, 1); }
                else if (dy < 0 && this.dy === 0) { this.setDirection(0, -1); }
            }
        });
    }

    handleKeyPress(e) {
        if (!this.gameStarted) {
            this.startGame();
        }

        switch(e.key) {
            case 'ArrowUp':
                if (this.dy === 0) this.setDirection(0, -1);
                break;
            case 'ArrowDown':
                if (this.dy === 0) this.setDirection(0, 1);
                break;
            case 'ArrowLeft':
                if (this.dx === 0) this.setDirection(-1, 0);
                break;
            case 'ArrowRight':
                if (this.dx === 0) this.setDirection(1, 0);
                break;
        }
    }

    setDirection(dx, dy) {
        // 防止反向移动
        if ((this.dx === -dx && dx !== 0) || (this.dy === -dy && dy !== 0)) {
            return;
        }
        this.dx = dx;
        this.dy = dy;
    }

    update() {
        // 移动蛇
        const head = {
            x: (this.snake[0].x + this.dx + this.tileCount) % this.tileCount,
            y: (this.snake[0].y + this.dy + this.tileCount) % this.tileCount
        };

        // 检查自身碰撞
        if (this.checkSelfCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = this.score;
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkSelfCollision(head) {
        return this.snake.some((segment, index) => 
            index !== 0 && segment.x === head.x && segment.y === head.y
        );
    }

    generateFood() {
        do {
            this.food.x = Math.floor(Math.random() * this.tileCount);
            this.food.y = Math.floor(Math.random() * this.tileCount);
        } while (this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y
        ));
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#bbada0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tileSize, 0);
            this.ctx.lineTo(i * this.tileSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tileSize);
            this.ctx.lineTo(this.canvas.width, i * this.tileSize);
            this.ctx.stroke();
        }

        // 绘制蛇
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#4CAF50';
            this.ctx.fillRect(
                segment.x * this.tileSize + 1,
                segment.y * this.tileSize + 1,
                this.tileSize - 2,
                this.tileSize - 2
            );
        });

        // 绘制食物
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.tileSize + 1,
            this.food.y * this.tileSize + 1,
            this.tileSize - 2,
            this.tileSize - 2
        );
    }

    gameOver() {
        clearInterval(this.gameLoop);
        alert(`游戏结束！得分：${this.score}`);
        this.container.innerHTML = '';
        const gameOverEvent = new Event('gameover');
        this.container.dispatchEvent(gameOverEvent);
    }

    destroy() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        this.container.innerHTML = '';
    }
} 