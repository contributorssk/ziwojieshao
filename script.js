// 获取主题切换按钮和body元素
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 主题切换功能优化
function initThemeToggle() {
    themeToggle.addEventListener('click', () => {
        // 切换深色模式类
        body.classList.toggle('dark-mode');
        
        // 保存用户偏好
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // 初始化主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
}

// 在 DOMContentLoaded 时初始化
document.addEventListener('DOMContentLoaded', initThemeToggle);

// 平滑滚动功能
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // 只处理页内链接
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// 北京时间显示功能
function updateBeijingTime() {
    // 获取时间显示元素
    const timeElement = document.querySelector('#beijing-time span');
    // 设置时间格式选项
    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    // 更新时间的函数
    function update() {
        const beijingTime = new Date().toLocaleString('zh-CN', options);
        timeElement.textContent = beijingTime;
    }

    // 立即更新一次时间
    update();
    // 每秒更新一次时间
    setInterval(update, 1000);
}

// 当页面加载完成后启动时钟
document.addEventListener('DOMContentLoaded', updateBeijingTime);

// 音乐控制功能
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    let isInitialized = false;

    // 音乐控制函数
    function toggleMusic() {
        try {
            if (!isInitialized) {
                // 第一次点击时加载音频
                backgroundMusic.load();
                isInitialized = true;
            }

            if (backgroundMusic.paused) {
                // 播放音乐
                let playPromise = backgroundMusic.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // 播放成功
                        musicToggle.classList.add('playing');
                    })
                    .catch(error => {
                        // 播放失败
                        console.error('播放失败:', error);
                        alert('音乐播放失败，请检查音频文件是否存在');
                    });
                }
            } else {
                // 暂停音乐
                backgroundMusic.pause();
                musicToggle.classList.remove('playing');
            }
        } catch (error) {
            console.error('音乐控制错误:', error);
        }
    }

    // 添加点击事件监听器
    musicToggle.addEventListener('click', toggleMusic);

    // 处理音频加载错误
    backgroundMusic.addEventListener('error', function(e) {
        console.error('音频加载错误:', e);
        alert('音频文件加载失败，请检查文件路径是否正确');
        musicToggle.style.display = 'none';
    });
});

// 添加滚动监听
document.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 添加页面加载动画
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// 优化图片加载
document.querySelectorAll('img').forEach(img => {
    img.loading = 'lazy';
});

// 添加滚动显示动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 添加点击波纹效果
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', createRipple);
});

// 添加全局错误处理
window.addEventListener('error', (event) => {
    console.error('页面错误:', event.error);
    // 可以添加错误提示或上报逻辑
});

// 优化图片加载失败处理
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        this.src = './tupian/fallback.jpg';
        this.alt = '图片加载失败';
    };
});

// 优化鼠标指针处理代码
function initCustomCursor() {
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    
    if (!cursorOuter || !cursorInner) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isStuck = false;
    let isHidden = false;

    // 使用 transform3d 和 will-change 优化性能
    cursorOuter.style.willChange = 'transform';
    cursorInner.style.willChange = 'transform';

    // 优化跟随动画
    function render() {
        if (!isStuck && !isHidden) {
            // 使用更平滑的缓动系数
            const easing = 0.12;
            currentX += (mouseX - currentX) * easing;
            currentY += (mouseY - currentY) * easing;
            
            // 使用 transform3d 提高性能
            cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            cursorOuter.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(render);
    }
    render();

    // 优化鼠标移动处理
    let frameId;
    document.addEventListener('mousemove', (e) => {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }
        
        frameId = requestAnimationFrame(() => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (isStuck) {
                cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
            }
        });
    });

    // 优化可点击元素交互
    const clickables = document.querySelectorAll('a, button, input, select, textarea, .achievement-card');
    clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            isStuck = true;
            const rect = el.getBoundingClientRect();
            const elemX = rect.left + rect.width / 2;
            const elemY = rect.top + rect.height / 2;

            // 添加平滑过渡
            cursorOuter.style.transition = 'transform 0.2s ease-out';
            cursorInner.style.transition = 'transform 0.2s ease-out';

            // 同步更新位置
            currentX = elemX;
            currentY = elemY;
            mouseX = elemX;
            mouseY = elemY;

            // 应用变换
            cursorOuter.style.transform = `translate3d(${elemX}px, ${elemY}px, 0) translate(-50%, -50%) scale(1.5)`;
            cursorInner.style.transform = `translate3d(${elemX}px, ${elemY}px, 0) translate(-50%, -50%) scale(1.5)`;
        });

        el.addEventListener('mouseleave', () => {
            isStuck = false;
            // 重置过渡
            cursorOuter.style.transition = 'transform 0.15s ease-out';
            cursorInner.style.transition = 'transform 0.15s ease-out';
            
            // 延迟后移除过渡效果
            setTimeout(() => {
                cursorOuter.style.transition = '';
                cursorInner.style.transition = '';
            }, 150);
        });
    });

    // 优化点击效果
    document.addEventListener('mousedown', () => {
        cursorOuter.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(0.9)`;
        cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.9)`;
    });

    document.addEventListener('mouseup', () => {
        cursorOuter.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(1)`;
        cursorInner.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
    });

    // 优化页面离开处理
    document.addEventListener('mouseleave', () => {
        isHidden = true;
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        isHidden = false;
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });

    // 添加滚动优化
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        isHidden = true;
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';

        scrollTimeout = setTimeout(() => {
            isHidden = false;
            cursorOuter.style.opacity = '1';
            cursorInner.style.opacity = '1';
        }, 100);
    }, { passive: true });
}

// 确保在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', initCustomCursor);

// 页面卸载时清理
window.addEventListener('unload', () => {
    if (cleanupCursor) {
        cleanupCursor();
    }
});

// 添加滚动进度指示器
function updateScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / maxScroll) * 100;
    indicator.style.width = `${scrolled}%`;
}

window.addEventListener('scroll', updateScrollIndicator);

// 优化图片加载
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 添加平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 优化页面加载
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    updateScrollIndicator();
    
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
    
    // 延迟加载非关键资源
    setTimeout(() => {
        const deferredStyles = document.querySelectorAll('link[data-defer]');
        deferredStyles.forEach(style => {
            style.setAttribute('rel', 'stylesheet');
            style.removeAttribute('data-defer');
        });
    }, 100);
});

// 导航栏滚动控制
let lastScrollTop = 0;
const nav = document.querySelector('nav');
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > scrollThreshold) {
        if (currentScroll > lastScrollTop) {
            // 向下滚动
            nav.classList.add('hide');
            nav.classList.remove('show');
        } else {
            // 向上滚动
            nav.classList.remove('hide');
            nav.classList.add('show');
        }
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
        nav.classList.remove('hide');
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// 优化加载动画
function initLoadingAnimation() {
    const loadingScreen = document.querySelector('.loading-screen');
    const contentWrapper = document.querySelector('.content-wrapper');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('loaded');
            if (contentWrapper) {
                contentWrapper.classList.add('visible');
            }
        }, 2000);
    });
}

// 在 DOMContentLoaded 时初始化
document.addEventListener('DOMContentLoaded', () => {
    initLoadingAnimation();
    // ... 其他初始化代码 ...
});

// 添加展开/收起功能
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector('.toggle-changelog');
    const timeline = document.querySelector('.timeline');
    const hiddenItems = document.querySelectorAll('.timeline-item.hidden');
    
    toggleBtn.addEventListener('click', function() {
        timeline.classList.toggle('collapsed');
        toggleBtn.classList.toggle('active');
        
        const isExpanded = !timeline.classList.contains('collapsed');
        toggleBtn.querySelector('.toggle-text').textContent = 
            isExpanded ? '收起记录' : '展开完整记录';
        
        hiddenItems.forEach(item => {
            if (isExpanded) {
                item.style.display = 'flex';
                setTimeout(() => {
                    item.classList.remove('hidden');
                }, 10);
            } else {
                item.classList.add('hidden');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 500);
            }
        });
    });
});

// 添加页面切换动画
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        // 淡出当前section
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
        });
        
        // 滚动到目标section并淡入
        setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            }, 300);
        }, 300);
    });
});

// 性能优化
function optimizePerformance() {
    // 延迟加载图片
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // 优化动画性能
    const animatedElements = document.querySelectorAll('.animated');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });

    // 清理不需要的will-change
    animatedElements.forEach(el => {
        el.addEventListener('animationend', () => {
            el.style.willChange = 'auto';
        });
    });
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', optimizePerformance);

// 添加加载超时处理
setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        document.body.classList.add('loaded');
    }
}, 5000);

// 移动端菜单处理优化
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navContent = document.querySelector('.nav-content');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !navContent) return;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navContent.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // 点击链接后关闭菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navContent.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!navContent.contains(e.target) && !menuToggle.contains(e.target)) {
            navContent.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });

    // 阻止菜单内部点击事件冒泡
    navContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// 优化滚动性能
function optimizeScroll() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollIndicator();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// 添加触摸设备检测
function initTouchDeviceOptimization() {
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
}

// 初始化所有优化
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    optimizeScroll();
    initTouchDeviceOptimization();
});

// 导航栏滚动效果
function handleScroll() {
    const nav = document.querySelector('nav');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // 更新活动链接
    updateActiveLink();
}

// 更新活动链接
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // 偏移量，确保准确检测

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            link?.classList.add('active');
        } else {
            link?.classList.remove('active');
        }
    });
}

// 添加滚动事件监听
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// 平滑滚动到目标位置
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            
            // 在移动端点击导航链接后关闭菜单
            const navContent = document.querySelector('.nav-content');
            navContent.classList.remove('active');
        }
    });
});

// 添加到现有的 DOMContentLoaded 事件监听器中
document.addEventListener('DOMContentLoaded', () => {
    // 调试导航链接
    const gameLink = document.querySelector('a[href="./games.html"]');
    if (gameLink) {
        gameLink.addEventListener('click', (e) => {
            console.log('游戏链接被点击');
        });
    }
});

// 游戏控制函数
function show2048Game() {
    const optionElement = document.getElementById('game2048-option');
    const containerElement = document.getElementById('game2048-container');
    const gridContainer = document.getElementById('grid-container');
    
    if (optionElement && containerElement) {
        optionElement.style.display = 'none';
        containerElement.style.display = 'block';
        
        // 确保游戏只初始化一次
        if (gridContainer && !gridContainer.hasChildNodes()) {
            console.log('初始化游戏');
            new Game2048(gridContainer);
        }
    } else {
        console.error('找不到游戏元素');
    }
}

function hideGame() {
    const optionElement = document.getElementById('game2048-option');
    const containerElement = document.getElementById('game2048-container');
    const gridContainer = document.getElementById('grid-container');
    
    if (optionElement && containerElement) {
        optionElement.style.display = 'block';
        containerElement.style.display = 'none';
        
        // 清空游戏区域
        if (gridContainer) {
            gridContainer.innerHTML = '';
        }
    }
}

// 贪吃蛇游戏控制
let snakeGame = null;

function showSnakeGame() {
    const optionElement = document.getElementById('snake-option');
    const containerElement = document.getElementById('snake-container');
    const gridElement = document.getElementById('snake-grid');
    
    if (optionElement && containerElement) {
        optionElement.style.display = 'none';
        containerElement.style.display = 'block';
        
        // 初始化游戏
        if (gridElement && !snakeGame) {
            console.log('初始化贪吃蛇游戏');
            snakeGame = new SnakeGame(gridElement);
            
            // 监听游戏结束事件
            gridElement.addEventListener('gameover', () => {
                snakeGame = null;
            });
        }
    } else {
        console.error('找不到贪吃蛇游戏元素');
    }
}

function hideSnakeGame() {
    const optionElement = document.getElementById('snake-option');
    const containerElement = document.getElementById('snake-container');
    
    if (optionElement && containerElement) {
        optionElement.style.display = 'block';
        containerElement.style.display = 'none';
        
        // 销毁游戏实例
        if (snakeGame) {
            snakeGame.destroy();
            snakeGame = null;
        }
    }
} 