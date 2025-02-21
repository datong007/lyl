class BirthdayParty {
    constructor() {
        this.canvas = document.getElementById('birthdayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.meteors = [];  // 添加流星数组
        this.wishes = [];
        this.candleLit = false;
        this.tigerX = -100; // 老虎初始位置
        this.tigerDirection = 1; // 老虎方向
        
        // 预加载老虎图片
        this.tigerImg = new Image();
        this.tigerImg.src = 'https://cdn.jsdelivr.net/gh/your-repo/cute-tiger.gif'; // 需要替换为实际的老虎图片URL
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        // 设置画布尺寸
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 创建星星和流星
        this.createStars(100);  // 增加星星数量
        this.createMeteors();   // 创建初始流星
        
        // 监听窗口调整
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                flicker: 0
            });
        }
    }

    createMeteors() {
        // 每隔一段时间创建新的流星
        setInterval(() => {
            if (this.meteors.length < 5) {  // 限制同时存在的流星数量
                this.meteors.push({
                    x: Math.random() * this.canvas.width,
                    y: 0,
                    length: Math.random() * 80 + 100,  // 流星长度
                    speed: Math.random() * 15 + 10,    // 流星速度
                    angle: Math.PI / 4,                // 流星角度
                    width: Math.random() * 2 + 1,      // 流星宽度
                    opacity: 1
                });
            }
        }, 2000);  // 每2秒尝试创建一个新流星
    }

    bindEvents() {
        // 许愿功能
        document.getElementById('makeWish').addEventListener('click', () => {
            document.getElementById('wishModal').style.display = 'block';
        });

        document.getElementById('sendWish').addEventListener('click', () => {
            const wishText = document.querySelector('.modal-content textarea').value;
            if (wishText) {
                this.addWish(wishText);
                document.getElementById('wishModal').style.display = 'none';
                document.querySelector('.modal-content textarea').value = '';
            }
        });

        // 蜡烛功能
        document.getElementById('lightCandle').addEventListener('click', () => {
            this.candleLit = !this.candleLit;
        });
    }

    addWish(text) {
        this.wishes.push({
            text,
            x: Math.random() * this.canvas.width,
            y: this.canvas.height,
            speed: 0.1
        });
    }

    drawStars() {
        this.stars.forEach(star => {
            // 闪烁效果
            star.flicker += Math.random() * 0.1;
            const flicker = Math.sin(star.flicker) * 0.3 + 0.7;
            
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`;
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawMeteors() {
        this.meteors.forEach((meteor, index) => {
            this.ctx.save();
            this.ctx.beginPath();
            
            // 创建流星的渐变效果
            const gradient = this.ctx.createLinearGradient(
                meteor.x, meteor.y,
                meteor.x + Math.cos(meteor.angle) * meteor.length,
                meteor.y + Math.sin(meteor.angle) * meteor.length
            );
            
            gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = meteor.width;
            this.ctx.lineCap = 'round';
            
            // 绘制流星主体
            this.ctx.moveTo(meteor.x, meteor.y);
            this.ctx.lineTo(
                meteor.x + Math.cos(meteor.angle) * meteor.length,
                meteor.y + Math.sin(meteor.angle) * meteor.length
            );
            
            this.ctx.stroke();
            this.ctx.restore();
            
            // 更新流星位置
            meteor.x += Math.cos(meteor.angle) * meteor.speed;
            meteor.y += Math.sin(meteor.angle) * meteor.speed;
            
            // 当流星移出屏幕时移除
            if (meteor.y > this.canvas.height || meteor.x > this.canvas.width) {
                this.meteors.splice(index, 1);
            }
        });
    }

    drawCake() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 蛋糕阴影
        this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
        this.ctx.shadowBlur = 20;
        
        // 蛋糕层次
        const colors = ['#FFB6C1', '#FF69B4', '#FF1493'];
        colors.forEach((color, i) => {
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY - i * 20, 100, 60, 0, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 重置阴影
        this.ctx.shadowBlur = 0;
        
        // 装饰
        for(let i = 0; i < 8; i++) {
            this.ctx.fillStyle = '#FFF';
            this.ctx.beginPath();
            this.ctx.arc(
                centerX + Math.cos(i/4 * Math.PI) * 80,
                centerY + Math.sin(i/4 * Math.PI) * 40,
                5, 0, Math.PI * 2
            );
            this.ctx.fill();
        }

        // 绘制更长的蜡烛
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(centerX - 5, centerY - 80, 10, 60); // 将高度从30改为60,起始位置相应上移

        // 如果蜡烛点燃，调整火焰位置
        if(this.candleLit) {
            const gradient = this.ctx.createRadialGradient(
                centerX, centerY - 105, 0,  // 调整火焰位置
                centerX, centerY - 105, 30
            );
            gradient.addColorStop(0, 'rgba(255, 165, 0, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY - 105, 30, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawWishes() {
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.textAlign = 'center';
        
        for (let i = this.wishes.length - 1; i >= 0; i--) {
            const wish = this.wishes[i];
            this.ctx.strokeText(wish.text, wish.x, wish.y);
            this.ctx.fillText(wish.text, wish.x, wish.y);
            wish.y -= wish.speed;

            if (wish.y < 0) {
                this.wishes.splice(i, 1);
            }
        }
        
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    drawTiger() {
        // 移动老虎
        this.tigerX += 2; // 调整移动速度
        
        // 如果老虎移出屏幕，重置位置
        if (this.tigerX > this.canvas.width + 100) {
            this.tigerX = -100;
        }

        // 绘制老虎
        if (this.tigerImg.complete) { // 确保图片已加载
            const tigerY = this.canvas.height * 0.7; // 老虎在画布70%的位置
            const tigerSize = 100; // 老虎大小
            
            // 添加可爱的弹跳效果
            const bounce = Math.sin(this.tigerX * 0.05) * 10;
            
            this.ctx.save();
            this.ctx.translate(this.tigerX, tigerY + bounce);
            this.ctx.drawImage(this.tigerImg, -tigerSize/2, -tigerSize/2, tigerSize, tigerSize);
            this.ctx.restore();
        }
    }

    animate() {
        // 清除画布，保留一点轨迹
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制所有元素
        this.drawStars();
        this.drawMeteors();  // 添加流星绘制
        this.drawCake();
        this.drawWishes();
        this.drawTiger();
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化
window.addEventListener('load', () => {
    new BirthdayParty();
}); 