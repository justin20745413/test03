<template>
    <div class="app-container">
        <!-- 載入動畫 -->
        <div
            class="loading-screen"
            :class="{ 'fade-out': isLoaded }"
            @mousemove="updateMousePosition"
        >
            <div class="loading-content">
                <!-- 座標追踪系統 -->
                <div class="coordinate-tracker" v-show="showCoordinates">
                    <!-- X軸線 -->
                    <div class="coordinate-line x-line" :style="{ top: `${mouseY}px` }"></div>
                    <!-- Y軸線 -->
                    <div class="coordinate-line y-line" :style="{ left: `${mouseX}px` }"></div>
                    <!-- 座標數值顯示 -->
                    <div
                        class="coordinate-values"
                        :style="{ left: `${mouseX + 15}px`, top: `${mouseY + 15}px` }"
                    >
                        X: {{ mouseX }} Y: {{ mouseY }}
                    </div>
                </div>

                <!-- 數字化圖案背景 -->
                <div class="digital-background">
                    <div
                        v-for="n in 40"
                        :key="`line-${n}`"
                        class="digital-line"
                        :style="{
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${2 + Math.random() * 8}s`,
                            animationDelay: `${Math.random() * 2}s`,
                            height: `${100 + Math.random() * 300}px`,
                            opacity: 0.1 + Math.random() * 0.4
                        }"
                    >
                        <span
                            v-for="i in 20"
                            :key="`digit-${n}-${i}`"
                            class="digital-char"
                            :style="{ animationDelay: `${Math.random() * 5}s` }"
                        >
                            {{ ['0', '1'][Math.floor(Math.random() * 2)] }}
                        </span>
                    </div>
                </div>

                <!-- 網格效果 -->
                <div class="loading-grid">
                    <div
                        v-for="n in 100"
                        :key="`grid-${n}`"
                        class="grid-cell"
                        :style="{
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${0.5 + Math.random() * 1}s`
                        }"
                    ></div>
                </div>

                <!-- 掃描線效果 -->
                <div class="scan-line"></div>

                <!-- LOADING文字 -->
                <div class="loading-text">
                    <div class="char-container"><span>L</span></div>
                    <div class="char-container"><span>O</span></div>
                    <div class="char-container"><span>A</span></div>
                    <div class="char-container"><span>D</span></div>
                    <div class="char-container"><span>I</span></div>
                    <div class="char-container"><span>N</span></div>
                    <div class="char-container"><span>G</span></div>
                </div>

                <!-- 載入進度條 -->
                <div class="progress-container">
                    <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                    <div class="progress-text">{{ Math.floor(progressPercentage) }}%</div>
                </div>

                <!-- 圓形波紋 -->
                <div class="ripple-container">
                    <div
                        v-for="n in 3"
                        :key="`ripple-${n}`"
                        class="ripple"
                        :style="{ animationDelay: `${n * 0.5}s` }"
                    ></div>
                </div>
            </div>
        </div>

        <!-- 主要內容 -->
        <div class="main-content" :class="{ 'fade-in': isLoaded }">
            <div class="spline-container">
                <div class="ui-layer">
                    <!-- 內容放這裡 -->
                    <nav class="navigation">
                        <div class="logo">DESIGN SHOP</div>
                        <div class="nav-links">
                            <a href="#" class="nav-link">首頁</a>
                            <a href="#" class="nav-link">商品</a>
                            <a href="#" class="nav-link">關於我們</a>
                            <a href="#" class="nav-link">聯繫我們</a>
                        </div>
                        <div class="cart-icon">
                            <span class="material-icons">shopping_cart</span>
                        </div>
                    </nav>
                    <div class="content-wrapper">
                        <h1 class="main-title">Best Seller</h1>
                        <p class="subtitle">探索我們最熱門的設計產品</p>

                        <!-- 促銷橫幅 -->
                        <div class="promo-banner">
                            <h2>限時優惠</h2>
                            <p>購買任意兩件商品，享受85折優惠！</p>
                            <button class="promo-button">立即選購</button>
                        </div>
                    </div>
                </div>

                <spline-viewer
                    class="spline-background"
                    loading-anim-type="none"
                    :url="backgroundSplineUrl"
                    auto-play="true"
                    auto-rotate="true"
                ></spline-viewer>
            </div>
            <footer class="page-footer">
                <p>© 2025 設計工作室 - 版權所有</p>
            </footer>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const backgroundSplineUrl = ref('')
const isLoaded = ref(false)
const progressPercentage = ref(0)

// 鼠標座標追踪變量
const mouseX = ref(0)
const mouseY = ref(0)
const showCoordinates = ref(true)

// 更新鼠標位置
const updateMousePosition = (event: MouseEvent) => {
    mouseX.value = event.clientX
    mouseY.value = event.clientY
}

onMounted(() => {
    // 載入 Spline Viewer
    if (!customElements.get('spline-viewer')) {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js'
        document.head.appendChild(script)
    }

    backgroundSplineUrl.value = 'https://prod.spline.design/F1R4iir2NvPv6Znd/scene.splinecode'

    // 在頁面載入完成後顯示內容
    document.body.style.overflow = 'hidden' // 頁面載入時禁止滾動

    // 模擬載入進度
    const loadingInterval = setInterval(() => {
        progressPercentage.value += 2
        if (progressPercentage.value >= 100) {
            clearInterval(loadingInterval)

            // 進度到100%時，等待短暫時間再完成載入
            setTimeout(() => {
                isLoaded.value = true
                setTimeout(() => {
                    document.body.style.overflow = 'auto' // 載入完成後恢復滾動
                }, 1500) // 等待淡出動畫結束後恢復滾動
            }, 500)
        }
    }, 50)
})
</script>

<style scoped lang="scss">
.app-container {
    position: relative;
    min-height: 100vh;
}

// 座標追踪系統樣式
.coordinate-tracker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10000;
}

.coordinate-line {
    position: absolute;
    background-color: rgba(0, 255, 0, 0.5);
    pointer-events: none;
}

.x-line {
    width: 100%;
    height: 1px;
    left: 0;
}

.y-line {
    width: 1px;
    height: 100%;
    top: 0;
}

.coordinate-values {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    color: #00ff41;
    padding: 5px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    pointer-events: none;
    border: 1px solid #00ff41;
    text-shadow: 0 0 5px rgba(0, 255, 65, 0.7);
}

// 載入動畫
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
        opacity 1.5s ease,
        visibility 1.5s ease;
    overflow: hidden;
}

.loading-content {
    text-align: center;
    position: relative;
    width: 100%;
    height: 100%;
}

// 數字化背景
.digital-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.digital-line {
    position: absolute;
    top: -100px;
    display: flex;
    flex-direction: column;
    color: #00ff41;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    animation: fallDown linear infinite;
}

.digital-char {
    margin: 2px 0;
    opacity: 0.7;
    animation: flicker 3s infinite;
}

@keyframes fallDown {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(100vh);
    }
}

@keyframes flicker {
    0%,
    100% {
        opacity: 0.7;
    }
    50% {
        opacity: 0.3;
    }
}

// 網格效果
.loading-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(10, 30px);
    grid-template-rows: repeat(10, 30px);
    gap: 2px;
    margin: 0 auto;
}

.grid-cell {
    width: 30px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(0, 140, 255, 0.5);
    opacity: 0;
    animation: revealCell cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes revealCell {
    0% {
        opacity: 0;
        transform: scale(0);
        background-color: rgba(0, 0, 0, 0.8);
    }
    50% {
        opacity: 1;
        transform: scale(1);
        background-color: rgba(9, 132, 227, 0.5);
    }
    100% {
        opacity: 0;
        transform: scale(1);
        background-color: rgba(0, 0, 0, 0);
    }
}

// 掃描線效果
.scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(
        90deg,
        rgba(0, 153, 255, 0) 0%,
        rgba(0, 153, 255, 0.5) 50%,
        rgba(0, 153, 255, 0) 100%
    );
    box-shadow: 0 0 15px rgba(0, 153, 255, 0.8);
    z-index: 3;
    animation: scanEffect 3s linear infinite;
}

@keyframes scanEffect {
    0% {
        transform: translateY(-100px);
    }
    100% {
        transform: translateY(100vh);
    }
}

// LOADING文字修正
.loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-family: 'Courier New', monospace;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    z-index: 4;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 153, 255, 0.5);
    backdrop-filter: blur(5px);
}

.char-container {
    width: 30px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.char-container span {
    display: inline-block;
    animation: pulse 1.5s infinite alternate;
    animation-delay: calc(var(--i) * 0.1s);
    text-shadow: 0 0 10px #0099ff;
}

.char-container:nth-child(1) span {
    --i: 0;
}
.char-container:nth-child(2) span {
    --i: 1;
}
.char-container:nth-child(3) span {
    --i: 2;
}
.char-container:nth-child(4) span {
    --i: 3;
}
.char-container:nth-child(5) span {
    --i: 4;
}
.char-container:nth-child(6) span {
    --i: 5;
}
.char-container:nth-child(7) span {
    --i: 6;
}

@keyframes pulse {
    0% {
        opacity: 0.4;
        transform: translateY(0);
        color: #0099ff;
        text-shadow: 0 0 5px rgba(0, 153, 255, 0.7);
    }
    100% {
        opacity: 1;
        transform: translateY(-5px);
        color: #ffffff;
        text-shadow:
            0 0 15px #0099ff,
            0 0 30px rgba(0, 153, 255, 0.5);
    }
}

// 進度條
.progress-container {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    overflow: hidden;
    z-index: 4;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0099ff, #6a11cb);
    border-radius: 5px;
    transition: width 0.2s ease-out;
    position: relative;
    overflow: hidden;
}

.progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
}

.progress-text {
    color: #fff;
    font-size: 14px;
    margin-top: 10px;
    font-family: monospace;
    letter-spacing: 1px;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

// 圓形波紋效果
.ripple-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
}

.ripple {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 2px solid rgba(0, 153, 255, 0.5);
    transform: translate(-50%, -50%);
    animation: rippleEffect 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

@keyframes rippleEffect {
    0% {
        transform: translate(-50%, -50%) scale(0.1);
        opacity: 1;
        border-width: 10px;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
        border-width: 1px;
    }
}

.fade-out {
    opacity: 0;
    visibility: hidden;
}

.main-content {
    opacity: 0;
    visibility: hidden;
    transition:
        opacity 1s ease,
        visibility 1s ease;
}

.fade-in {
    opacity: 1;
    visibility: visible;
}

// 原有的樣式
.spline-container {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom right, #88aff7, #ffffff);
}

.spline-background {
    top: 0;
    left: 0;
    width: 170%;
    height: 110%;
    transform: scale(1.8);
    z-index: 1;
}

/* 導航欄樣式 */
.navigation {
    position: relative;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    backdrop-filter: blur(10px);
    background-color: transparent;
    pointer-events: none;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgb(255, 255, 255);
}

.logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    pointer-events: auto;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    position: relative;
    padding: 0.5rem 0;
    transition: all 0.3s;
    pointer-events: auto;

    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: white;
        transition: width 0.3s;
    }

    &:hover:after {
        width: 100%;
    }
}

.cart-icon {
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    pointer-events: auto;
}

/* 內容區域樣式 */
.content-wrapper {
    position: relative;
    z-index: 10;
    padding: 2rem;
    text-align: center;
    background-color: transparent;
}

.main-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 3rem;
}

/* 產品卡片區域 */
.products-section {
    position: relative;
    display: flex;
    justify-content: center;
    min-height: 500px;
    margin: 2rem 0 4rem;
}

.product-card_left {
    position: absolute;
    bottom: 30px;
    left: 100px;
    width: 380px;
    height: 480px;
    z-index: 10;
    perspective: 1000px;
    transition: transform 0.3s ease;
    border-radius: 16px;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -34%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.14) 0%,
            rgba(255, 255, 255, 0.1) 77%,
            rgba(255, 255, 255, 0.9) 92%,
            rgba(255, 255, 255, 0) 100%
        );
        transform: rotate(-45deg);
        z-index: 2;
        pointer-events: none;
    }
    &:hover {
        transform: translateY(-10px);
        .card-content {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
    }
}

.product-card_right {
    position: absolute;
    bottom: 30px;
    right: 100px;
    width: 380px;
    height: 480px;
    z-index: 10;
    perspective: 1000px;
    transition: transform 0.3s ease;
    border-radius: 16px;

    &:hover {
        transform: translateY(-10px);
        .card-content {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
    }
}

.card-content {
    border-radius: 24px;
    padding: 1.5rem;
    height: 100%;
    backdrop-filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.product-info {
    text-align: center;
    margin-bottom: 1rem;
    z-index: 5;
}

.product-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: white;
}

.product-description {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.9);
}

/* 促銷橫幅 */
.promo-banner {
    z-index: 20;
    background: linear-gradient(to right, rgba(59, 130, 246, 0.7), rgba(139, 92, 246, 0.7));
    border-radius: 16px;
    backdrop-filter: blur(10px);
    text-align: center;
    max-width: 800px;
    margin: 1.9rem auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

    h2 {
        color: white;
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
    }

    p {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 1.5rem;
    }
}

.promo-button {
    position: relative;
    background: white;
    color: #8b5cf6;
    padding: 0.75rem 2rem;
    margin-bottom: 1rem;
    border-radius: 12px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    pointer-events: auto;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }
}

.page-footer {
    position: relative;
    z-index: 100;
    text-align: center;
    padding: 2rem;
    color: white;
    backdrop-filter: blur(10px);
    background-color: transparent;
    pointer-events: none;
    background: #000;
}
</style>
