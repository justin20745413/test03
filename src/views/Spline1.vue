<template>
    <div class="spline-container">
        <!-- 背景動畫 -->
        <spline-viewer
            class="spline-background"
            loading-anim-type="none"
            :url="backgroundSplineUrl"
        ></spline-viewer>

        <!-- 內容部分 -->
    </div>
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
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to bottom right, #88aff7, #ffffff);
}

.spline-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 110%;
    z-index: 0;
}

.content {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    backdrop-filter: blur(8px);
    margin: 2rem auto;
    max-width: 800px;
}
.product-card_left {
    position: absolute;
    bottom: 110px;
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
    bottom: 110px;
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
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.product-info {
    text-align: center;
    margin-bottom: 1rem;
}

.product-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.product-description {
    font-size: 0.9rem;
}

.model-container {
    flex: 1;
    margin: 1rem 0;
    border-radius: 16px;
    overflow: hidden;
    background: rgba(223, 223, 223, 0.5);
    position: relative;
}

.model-wrapper {
    position: absolute;
    top: -10%;
    left: 0;
    width: 100%;
    height: 160%;
}

.spline-interactive {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    :hover {
        cursor: grab;
    }
}

.spline-interactive_left {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    :hover {
        cursor: grab;
    }
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(229, 231, 235, 0.5);
}

.price {
    font-size: 1.5rem;
    font-weight: 700;
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

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
}

.box1 {
    position: relative;
    width: 55px;
    height: 50px;
    background: rgb(0, 0, 0);
}

.box2 {
    width: 55px;
    height: 50px;
    background: rgb(0, 0, 0);
    border: 1px solid rgb(255, 255, 255);
}

.box1::before {
    position: absolute;
    content: '';
    width: 40px;
    height: 0px;
    background: rgb(0, 68, 255);
    bottom: 0;
    left: 80px;
    transition: height 0.5s;
    z-index: 4;
}

.box1:hover {
    transform: rotate(360deg);
    transition: transform 0.5s;
}

.box1:hover::before {
    height: 30px;
}

.box1::after {
    position: absolute;
    content: '';
    width: 40px;
    height: 0px;
    background: rgb(0, 174, 255);
    bottom: 0;
    left: 80px;
    transition: height 0.5s;
    z-index: 3;
}

.box1:hover::after {
    height: 60px;
}

.box2::before {
    position: absolute;
    content: '';
    width: 40px;
    height: 0px;
    background: rgb(0, 255, 179);
    bottom: 0;
    left: 80px;
    transition: height 0.5s;
    z-index: 2;
}

.box2:hover::before {
    height: 90px;
}

.box2::after {
    position: absolute;
    content: '';
    width: 40px;
    height: 0px;
    background: rgb(27, 228, 0);
    bottom: 0;
    left: 80px;
    transition: height 0.5s;
    z-index: 1;
}

.box2:hover::after {
    height: 120px;
}
</style>
