<template>
    <div class="spline-container">
        <div class="ui-layer">
            <!-- 内容放这里 -->
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

        <!-- 背景动画在最底层 -->
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
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const backgroundSplineUrl = ref('')

onMounted(() => {
    if (!customElements.get('spline-viewer')) {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js'
        document.head.appendChild(script)
    }

    backgroundSplineUrl.value = 'https://prod.spline.design/F1R4iir2NvPv6Znd/scene.splinecode'
})
</script>

<style scoped lang="scss">
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

.model-container {
    flex: 1;
    margin: 1rem 0;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
}

.model-wrapper {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 160%;
}

.spline-interactive,
.spline-interactive_left {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    &:hover {
        cursor: grab;
    }
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 5;
}

.price {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
}

.buy-button {
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    pointer-events: auto;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
}

/* 促銷橫幅 */
.promo-banner {
    z-index: 20;
    background: linear-gradient(to right, rgba(59, 130, 246, 0.7), rgba(139, 92, 246, 0.7));
    padding: 2rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    text-align: center;
    max-width: 800px;
    margin: 2rem auto;
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
