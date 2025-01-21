// 雪花类
class Snowflake {
    // 雪花构造函数，初始化雪花属性
    constructor() {
        this.x = Math.random() * window.innerWidth;        // 随机X坐标
        this.y = Math.random() * window.innerHeight * -1;  // 随机Y坐标（屏幕上方）
        this.size = Math.random() * 3 + 2;                // 随机大小（2-5像素）
        this.speed = Math.random() * 1 + 0.5;             // 随机下落速度
        this.opacity = Math.random() * 0.6 + 0.4;         // 随机透明度
    }

    // 更新雪花位置
    update() {
        this.y += this.speed;  // 垂直下落
        this.x += Math.sin(this.y / 30) * 0.5;  // 水平摆动

        // 如果雪花落到屏幕底部，重置到顶部
        if (this.y > window.innerHeight) {
            this.y = Math.random() * window.innerHeight * -1;
            this.x = Math.random() * window.innerWidth;
        }
    }

    // 绘制雪花
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 雪花效果类
class SnowEffect {
    // 初始化雪花效果
    constructor() {
        // 创建画布
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.isActive = false;

        // 设置画布样式
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';

        // 添加画布到页面
        document.body.appendChild(this.canvas);

        // 调整画布大小
        this.resize();
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());

        // 创建100个雪花
        for (let i = 0; i < 100; i++) {
            this.snowflakes.push(new Snowflake());
        }
    }

    // 调整画布大小
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // 开始雪花动画
    start() {
        this.isActive = true;
        this.animate();
    }

    // 停止雪花动画
    stop() {
        this.isActive = false;
        // 立即清除画布上的所有雪花
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 动画循环
    animate() {
        if (!this.isActive) return;

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新并绘制所有雪花
        this.snowflakes.forEach(snowflake => {
            snowflake.update();
            snowflake.draw(this.ctx);
        });

        // 请求下一帧动画
        requestAnimationFrame(() => this.animate());
    }
}

// 创建雪花效果实例
const snowEffect = new SnowEffect();

// 导出雪花效果切换函数
window.toggleSnow = function() {
    const snowButton = document.getElementById('snow-toggle');
    if (snowEffect.isActive) {
        // 停止雪花效果
        snowEffect.stop();
        snowButton.innerHTML = '<i class="fas fa-snowflake"></i>';
    } else {
        // 开启雪花效果
        snowEffect.start();
        snowButton.innerHTML = '<i class="fas fa-snowflake" style="color: #3498db;"></i>';
    }
}; 