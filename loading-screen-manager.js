/**
 * Herta's Game Center - 加載畫面管理器
 * 為所有遊戲提供統一的主題感知加載畫面
 */

class LoadingScreenManager {
    constructor(options = {}) {
        this.options = {
            gameTitle: options.gameTitle || '遊戲',
            gameIcon: options.gameIcon || '🎮',
            gameDescription: options.gameDescription || '加載中...',
            targetUrl: options.targetUrl || '',
            loadingTime: options.loadingTime || 3000, // 默認3秒
            theme: options.theme || 'auto', // 'dark', 'light', or 'auto'
            showTips: options.showTips !== false,
            ...options
        };

        this.progress = 0;
        this.isLoading = false;
        this.loadingScreen = null;
        this.intervalId = null;
        
        this.tips = [
            "戰術提示：閃避比硬拼更有效。",
            "連擊可以獲得更高分數！保持節奏，不要中斷連鎖攻擊。",
            "觀察敵人模式，找到最佳攻擊時機。",
            "善用環境掩護，減少受到的傷害。",
            "收集道具可以增強角色能力。",
            "保持移動，不要停留在同一個位置太久。",
            "學習敵人的攻擊模式，提前做好閃避準備。",
            "合理分配資源，不要一次性用完所有技能。",
            "團隊合作時，注意隊友的位置和狀態。",
            "練習是提高遊戲技巧的最佳方式。"
        ];
    }

    /**
     * 檢測用戶主題偏好
     */
    detectTheme() {
        if (this.options.theme !== 'auto') {
            return this.options.theme;
        }

        // 檢查 localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }

        // 檢查系統偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light'; // 默認淺色模式
    }

    /**
     * 獲取隨機提示
     */
    getRandomTip() {
        return this.tips[Math.floor(Math.random() * this.tips.length)];
    }

    /**
     * 創建深色模式加載畫面
     */
    createDarkLoadingScreen() {
        const tip = this.getRandomTip();
        
        return `
            <!DOCTYPE html>
            <html class="dark" lang="zh-TW">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.options.gameTitle} - 加載中</title>
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
                <script id="tailwind-config">
                    tailwind.config = {
                        darkMode: "class",
                        theme: {
                            extend: {
                                colors: {
                                    "primary": "#00ffcc",
                                    "background-light": "#f5f8f8",
                                    "background-dark": "#0f231f",
                                },
                                fontFamily: {
                                    "display": ["Space Grotesk", "Noto Sans TC", "sans-serif"]
                                },
                                borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                            },
                        },
                    }
                </script>
                <style>
                    .neon-text-shadow {
                        text-shadow: 0 0 10px rgba(0, 255, 204, 0.7);
                    }
                    .neon-box-shadow {
                        box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spinner {
                        animation: spin 2s linear infinite;
                    }
                </style>
            </head>
            <body class="bg-background-dark font-display h-screen w-full overflow-hidden flex flex-col relative text-white">
                <!-- Background -->
                <div class="absolute inset-0 z-0">
                    <div class="absolute inset-0 bg-gradient-to-b from-[#0f0c29]/90 via-[#0f231f]/95 to-[#0f231f]"></div>
                    <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(#00ffcc 1px, transparent 1px); background-size: 40px 40px;"></div>
                </div>

                <!-- Main Content -->
                <div class="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-6">
                    <!-- Centerpiece -->
                    <div class="relative mb-12 flex items-center justify-center">
                        <div class="absolute w-48 h-48 rounded-full border border-primary/20"></div>
                        <div class="absolute w-56 h-56 rounded-full border border-primary/10 border-dashed spinner"></div>
                        <div class="w-40 h-40 rounded-full border-4 border-t-primary border-r-primary/50 border-b-primary/10 border-l-primary/10 neon-box-shadow flex items-center justify-center bg-[#0f0c29]/50 backdrop-blur-sm">
                            <span class="text-6xl">${this.options.gameIcon}</span>
                        </div>
                    </div>

                    <!-- System Text -->
                    <div class="flex flex-col items-center gap-2 mb-10 w-full">
                        <h1 class="text-4xl md:text-5xl font-bold text-white tracking-widest uppercase neon-text-shadow text-center">
                            ${this.options.gameTitle}
                        </h1>
                        <p class="text-primary/60 text-sm tracking-[0.2em] uppercase">${this.options.gameDescription}</p>
                    </div>

                    <!-- Progress Section -->
                    <div class="w-full max-w-lg flex flex-col gap-3">
                        <div class="flex justify-between items-end px-1">
                            <span class="text-white/80 text-sm font-medium tracking-wide">加載遊戲資源...</span>
                            <span id="progress-percent" class="text-primary font-bold text-lg neon-text-shadow">0%</span>
                        </div>
                        <div class="h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
                            <div id="progress-bar" class="h-full bg-primary rounded-full relative shadow-[0_0_15px_#00ffcc]" style="width: 0%;">
                                <div class="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Tip -->
                    ${this.options.showTips ? `
                    <div class="mt-16 p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md max-w-xl w-full text-center relative">
                        <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
                        <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary"></div>
                        <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary"></div>
                        <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary"></div>
                        <div class="flex items-center justify-center gap-3">
                            <span class="material-symbols-outlined text-primary text-xl">lightbulb</span>
                            <p class="text-cyan-100/90 text-base md:text-lg font-light tracking-wide">${tip}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Bottom Status -->
                <div class="absolute bottom-0 w-full border-t border-white/5 bg-[#0f0c29]/80 backdrop-blur-xl py-2 px-6 flex justify-between items-center text-[10px] text-white/40 font-mono tracking-widest z-20">
                    <div class="flex gap-4">
                        <span>HERTA GAME CENTER</span>
                        <span>${this.options.gameTitle.toUpperCase()}</span>
                    </div>
                    <div class="flex gap-4 items-center">
                        <span id="status-text">初始化中...</span>
                        <div class="flex gap-1">
                            <div class="w-1 h-3 bg-primary rounded-full"></div>
                            <div class="w-1 h-3 bg-primary rounded-full"></div>
                            <div class="w-1 h-3 bg-primary rounded-full"></div>
                            <div class="w-1 h-3 bg-primary/30 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <script>
                    let progress = 0;
                    const progressBar = document.getElementById('progress-bar');
                    const progressPercent = document.getElementById('progress-percent');
                    const statusText = document.getElementById('status-text');
                    
                    const statusMessages = [
                        "初始化遊戲引擎...",
                        "加載資源文件...",
                        "準備遊戲場景...",
                        "初始化音效系統...",
                        "校準控制設定...",
                        "準備完成..."
                    ];
                    
                    function updateProgress() {
                        if (progress >= 100) {
                            progress = 100;
                            progressBar.style.width = progress + '%';
                            progressPercent.textContent = progress + '%';
                            statusText.textContent = "準備進入遊戲...";
                            
                            // 延遲後跳轉
                            setTimeout(() => {
                                window.location.href = '${this.options.targetUrl}';
                            }, 500);
                            return;
                        }
                        
                        // 隨機增加進度
                        const increment = 1 + Math.random() * 3;
                        progress = Math.min(progress + increment, 100);
                        
                        progressBar.style.width = progress + '%';
                        progressPercent.textContent = Math.floor(progress) + '%';
                        
                        // 更新狀態消息
                        const statusIndex = Math.floor(progress / (100 / statusMessages.length));
                        if (statusIndex < statusMessages.length) {
                            statusText.textContent = statusMessages[statusIndex];
                        }
                        
                        // 繼續更新
                        setTimeout(updateProgress, 50 + Math.random() * 100);
                    }
                    
                    // 開始加載
                    setTimeout(updateProgress, 500);
                </script>
            </body>
            </html>
        `;
    }

    /**
     * 創建淺色模式加載畫面
     */
    createLightLoadingScreen() {
        const tip = this.getRandomTip();
        
        return `
            <!DOCTYPE html>
            <html class="light" lang="zh-TW">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.options.gameTitle} - 加載中</title>
                <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
                <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
                <script id="tailwind-config">
                    tailwind.config = {
                        darkMode: "class",
                        theme: {
                            extend: {
                                colors: {
                                    "primary": "#ee8c2b",
                                    "secondary": "#ef4444", 
                                    "background-light": "#ffffff",
                                    "background-dark": "#221910",
                                    "surface-light": "#f8f7f6",
                                    "surface-dark": "#2d241b",
                                    "text-primary-light": "#1b140d",
                                    "text-secondary-light": "#6b5e53",
                                },
                                fontFamily: {
                                    "display": ["Be Vietnam Pro", "sans-serif"]
                                },
                                borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                            },
                        },
                    }
                </script>
                <style>
                    .loading-shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        animation: shimmer 1.5s infinite;
                    }
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                    .pulse-icon {
                        animation: pulse 2s infinite;
                    }
                </style>
            </head>
            <body class="font-display bg-background-light text-text-primary-light min-h-screen flex flex-col overflow-hidden relative">
                <!-- Background -->
                <div class="absolute inset-0 z-0 opacity-40 pointer-events-none bg-grid-pattern bg-[size:40px_40px]"></div>

                <!-- Main Content -->
                <div class="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-8">
                    <!-- Game Icon -->
                    <div class="flex flex-col items-center mb-12">
                        <div class="relative group">
                            <div class="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                            <div class="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-white to-surface-light rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/50 flex items-center justify-center transform transition-transform duration-700">
                                <span class="text-[64px] sm:text-[80px] pulse-icon">${this.options.gameIcon}</span>
                            </div>
                        </div>
                        <h1 class="mt-8 text-4xl sm:text-5xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-text-primary-light to-text-secondary-light">
                            ${this.options.gameTitle}
                        </h1>
                        <p class="mt-2 text-text-secondary-light font-medium text-sm tracking-widest uppercase opacity-80">${this.options.gameDescription}</p>
                    </div>

                    <!-- Loading Area -->
                    <div class="w-full max-w-[480px] flex flex-col gap-4">
                        <div class="flex justify-between items-end px-1">
                            <h2 class="text-xl font-bold text-text-primary-light">正在進入遊戲...</h2>
                            <span id="progress-percent" class="text-primary font-bold font-mono text-lg">0%</span>
                        </div>
                        <div class="h-4 w-full bg-surface-light rounded-full overflow-hidden shadow-inner border border-gray-100 p-0.5">
                            <div id="progress-bar" class="h-full w-0 rounded-full bg-gradient-to-r from-primary to-secondary relative overflow-hidden transition-all duration-300 ease-out shadow-sm">
                                <div class="absolute inset-0 loading-shimmer w-full h-full"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Tip -->
                    ${this.options.showTips ? `
                    <div class="bg-surface-light/50 backdrop-blur-sm rounded-xl p-4 mt-8 border border-white/50 shadow-sm text-center max-w-md">
                        <div class="flex items-center justify-center gap-2 mb-1 text-primary">
                            <span class="material-symbols-outlined text-sm">lightbulb</span>
                            <span class="text-xs font-bold uppercase tracking-wider">遊戲提示</span>
                        </div>
                        <p class="text-text-secondary-light text-sm font-medium leading-relaxed">${tip}</p>
                    </div>
                    ` : ''}
                </div>

                <!-- Bottom Graphic -->
                <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-0"></div>

                <script>
                    let progress = 0;
                    const progressBar = document.getElementById('progress-bar');
                    const progressPercent = document.getElementById('progress-percent');
                    
                    const steps = [
                        { percent: 20, message: "檢查遊戲文件..." },
                        { percent: 40, message: "初始化遊戲引擎..." },
                        { percent: 60, message: "加載遊戲資源..." },
                        { percent: 80, message: "準備遊戲場景..." },
                        { percent: 95, message: "最終檢查..." },
                        { percent: 100, message: "準備完成！" }
                    ];
                    
                    function updateProgress() {
                        if (progress >= 100) {
                            progress = 100;
                            progressBar.style.width = progress + '%';
                            progressPercent.textContent = progress + '%';
                            
                            // 短暫延遲後跳轉
                            setTimeout(() => {
                                window.location.href = '${this.options.targetUrl}';
                            }, 800);
                            return;
                        }
                        
                        // 平滑增加進度
                        const increment = 0.5 + Math.random() * 1.5;
                        progress = Math.min(progress + increment, 100);
                        
                        progressBar.style.width = progress + '%';
                        progressPercent.textContent = Math.floor(progress) + '%';
                        
                        // 更新標題（可選）
                        const currentStep = steps.find(step => progress <= step.percent) || steps[steps.length - 1];
                        document.querySelector('h2').textContent = currentStep.message;
                        
                        // 繼續更新
                        setTimeout(updateProgress, 30 + Math.random() * 70);
                    }
                    
                    // 開始加載
                    setTimeout(updateProgress, 300);
                </script>
            </body>
            </html>
        `;
    }

    /**
     * 顯示加載畫面
     */
    show() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const theme = this.detectTheme();
        
        // 創建加載畫面 HTML
        const loadingHTML = theme === 'dark' 
            ? this.createDarkLoadingScreen() 
            : this.createLightLoadingScreen();
        
        // 在新窗口或當前窗口顯示
        if (this.options.openInNewWindow && this.options.targetUrl) {
            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.document.write(loadingHTML);
                newWindow.document.close();
                this.loadingScreen = newWindow;
            } else {
                // 如果彈出窗口被阻止，在當前頁面顯示
                this.showInCurrentWindow(loadingHTML);
            }
        } else {
            this.showInCurrentWindow(loadingHTML);
        }
    }

    /**
     * 在當前窗口顯示加載畫面
     */
    showInCurrentWindow(html) {
        document.open();
        document.write(html);
        document.close();
        this.loadingScreen = window;
    }

    /**
     * 隱藏加載畫面
     */
    hide() {
        if (this.loadingScreen && this.loadingScreen !== window) {
            this.loadingScreen.close();
        }
        this.isLoading = false;
    }

    /**
     * 快速啟動加載畫面（便捷方法）
     */
    static quickStart(gameTitle, gameIcon, targetUrl) {
        const manager = new LoadingScreenManager({
            gameTitle,
            gameIcon,
            targetUrl,
            loadingTime: 2500
        });
        manager.show();
        return manager;
    }
}

// 導出給全局使用
if (typeof window !== 'undefined') {
    window.LoadingScreenManager = LoadingScreenManager;
}

// 導出模組
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoadingScreenManager;
}