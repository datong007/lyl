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
        this.tigerImg.src = 'https://uy.wzznft.com/i/2025/02/22/iygmto.gif'; // 移除换行符
        
        this.notes = [];  // 存储音符
        this.isPlaying = false;  // 音乐播放状态
        this.audio = document.getElementById('birthdaySong');
        
        // 音符表情符号数组
        this.noteSymbols = ['♪', '♫', '♬', '🎵', '🎶'];
        
        // 添加祝福语容器
        this.wishContainer = document.createElement('div');
        this.wishContainer.className = 'wish-display';
        document.body.appendChild(this.wishContainer);
        
        this.init();
        this.bindEvents();
        this.animate();

        // 添加错误处理
        this.audio.addEventListener('error', (e) => {
            console.error('音频加载失败:', e);
            alert('抱歉，音乐加载失败，请刷新页面重试');
        });

        this.tigerImg.addEventListener('error', (e) => {
            console.error('老虎图片加载失败:', e);
        });
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
            // 添加按钮状态切换
            const button = document.getElementById('lightCandle');
            if (this.candleLit) {
                button.innerHTML = '💨 吹蜡烛';
                button.style.background = 'rgba(255, 165, 0, 0.3)';
            } else {
                button.innerHTML = '🕯️ 点蜡烛';
                button.style.background = 'rgba(255,255,255,0.1)';
            }
        });

        // 音乐控制
        document.getElementById('playMusic').addEventListener('click', () => {
            const button = document.getElementById('playMusic');
            if (this.isPlaying) {
                this.audio.pause();
                this.isPlaying = false;
                button.innerHTML = '🎵 生日歌';
                button.classList.remove('playing');
            } else {
                this.audio.play().catch(error => {
                    console.log("播放失败:", error);
                });
                this.isPlaying = true;
                button.innerHTML = '🎵 暂停';
                button.classList.add('playing');
            }
        });

        // 关闭弹窗
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('wishModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    addWish(text) {
        // 创建新的祝福语元素
        const wishElement = document.createElement('div');
        wishElement.className = 'wish-item';
        
        // 随机样式
        const styles = [
            'linear-gradient(45deg, rgba(255,105,180,0.2), rgba(135,206,235,0.2))',
            'linear-gradient(45deg, rgba(255,223,186,0.2), rgba(255,105,180,0.2))',
            'linear-gradient(45deg, rgba(135,206,235,0.2), rgba(255,223,186,0.2))'
        ];
        
        wishElement.style.background = styles[Math.floor(Math.random() * styles.length)];
        
        // 处理长文本，每15个字符换行
        const words = text.split('');
        let formattedText = '';
        for(let i = 0; i < words.length; i += 15) {  // 减少每行字符数
            formattedText += words.slice(i, i + 15).join('') + '\n';
        }
        
        wishElement.textContent = formattedText;
        this.wishContainer.appendChild(wishElement);
        
        // 延长显示时间
        setTimeout(() => {
            wishElement.remove();
        }, 8000);  // 8秒后消失
        
        // 添加到画布上的动画效果
        const wish = {
            text: formattedText,  // 使用格式化后的文本
            x: Math.random() * this.canvas.width,
            y: this.canvas.height,
            speed: Math.random() * 0.8 + 0.3,  // 降低上升速度
            opacity: 1,
            scale: Math.random() * 0.3 + 0.3  // 减小缩放范围
        };
        this.wishes.push(wish);
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

        // 如果蜡烛点燃，绘制更明亮的火焰
        if(this.candleLit) {
            // 外层光晕
            const outerGradient = this.ctx.createRadialGradient(
                centerX, centerY - 105, 0,
                centerX, centerY - 105, 40
            );
            outerGradient.addColorStop(0, 'rgba(255, 165, 0, 0.2)');
            outerGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
            this.ctx.fillStyle = outerGradient;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY - 105, 40, 0, Math.PI * 2);
            this.ctx.fill();

            // 火焰动画
            const time = Date.now() / 200;
            const flameHeight = Math.sin(time) * 5;
            
            // 内层火焰
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 8, centerY - 105);
            this.ctx.quadraticCurveTo(
                centerX, centerY - 130 - flameHeight,
                centerX + 8, centerY - 105
            );
            this.ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
            this.ctx.fill();
        }
    }

    drawWishes() {
        this.ctx.save();
        for(let i = this.wishes.length - 1; i >= 0; i--) {
            const wish = this.wishes[i];
            
            // 更新位置和透明度
            wish.y -= wish.speed;
            wish.opacity = Math.max(0, wish.opacity - 0.001);  // 降低透明度变化速度
            
            // 设置样式
            this.ctx.font = `${14 * wish.scale}px Arial`;  // 减小字体大小
            this.ctx.fillStyle = `rgba(255,255,255,${wish.opacity})`;
            this.ctx.textAlign = 'center';
            
            // 绘制文本
            const lines = wish.text.split('\n');
            lines.forEach((line, index) => {
                this.ctx.fillText(line, wish.x, wish.y + (index * 16 * wish.scale));
            });
            
            // 移除不可见的祝福
            if(wish.opacity <= 0) {
                this.wishes.splice(i, 1);
            }
        }
        this.ctx.restore();
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

    createNote() {
        if (this.isPlaying && Math.random() < 0.05) {  // 控制音符生成频率
            const note = {
                symbol: this.noteSymbols[Math.floor(Math.random() * this.noteSymbols.length)],
                x: Math.random() * this.canvas.width,
                y: this.canvas.height,
                speed: Math.random() * 2 + 1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                amplitude: Math.random() * 50 + 25,
                frequency: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            };
            this.notes.push(note);
        }
    }

    drawNotes() {
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = 'rgba(255, 192, 203, 0.8)';
        
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            
            // 更新音符位置
            note.y -= note.speed;
            note.phase += note.frequency;
            note.rotation += note.rotationSpeed;
            
            const x = note.x + Math.sin(note.phase) * note.amplitude;
            
            this.ctx.save();
            this.ctx.translate(x, note.y);
            this.ctx.rotate(note.rotation);
            this.ctx.fillText(note.symbol, 0, 0);
            this.ctx.restore();
            
            // 移除超出屏幕的音符
            if (note.y < -50) {
                this.notes.splice(i, 1);
            }
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
        this.createNote();  // 创建新音符
        this.drawNotes();   // 绘制音符
        
        requestAnimationFrame(() => this.animate());
    }
}

// 初始化
window.addEventListener('load', () => {
    new BirthdayParty();
}); 