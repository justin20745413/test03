<template>
    <div class="container">
        <!-- 背景動畫 -->
        <spline-viewer
            class="spline-background"
            loading-anim-type="none"
            :url="backgroundSplineUrl"
        ></spline-viewer>

        <!-- 商品卡片 -->
        <q-card class="product-card_left">
            <div class="card-content">
                <!-- 商品標題 -->
                <div class="product-info">
                    <h2 class="product-title">Limited Edition</h2>
                    <p class="product-description">Interactive 3D Experience</p>
                </div>

                <!-- 3D 模型顯示區 -->
                <div class="model-container">
                    <div class="model-wrapper">
                        <spline-viewer
                            class="spline-interactive_left"
                            loading-anim-type="none"
                            :url="productSplineUrl_left"
                        ></spline-viewer>
                    </div>
                </div>

                <!-- 商品操作區 -->
                <div class="card-footer">
                    <span class="price">USD $29990</span>
                    <button class="buy-button">View Details</button>
                </div>
            </div>
        </q-card>

        <!-- 內容部分 -->
        <div class="content">
            <h1
                class="tw-text-4xl tw-font-bold tw-mb-4 tw-bg-clip-text tw-text-transparent tw-bg-gradient-to-r tw-from-blue-600 tw-to-purple-600"
            >
                You can do anything 3D web
            </h1>
            <p class="text-lg text-gray-700 font-medium">
                spline-viewer: https://app.spline.design/community
            </p>
        </div>

        <!-- 商品卡片 -->
        <q-card class="product-card_right">
            <div class="card-content">
                <!-- 商品標題 -->
                <div class="product-info">
                    <h2 class="product-title">Limited Edition</h2>
                    <p class="product-description">Interactive 3D Experience</p>
                </div>

                <!-- 3D 模型顯示區 -->
                <div class="model-container">
                    <div class="model-wrapper">
                        <spline-viewer
                            class="spline-interactive"
                            loading-anim-type="none"
                            :url="productSplineUrl"
                        ></spline-viewer>
                    </div>
                </div>

                <!-- 商品操作區 -->
                <div class="card-footer">
                    <span class="price">USD $29990</span>
                    <button class="buy-button">View Details</button>
                </div>
            </div>
        </q-card>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const backgroundSplineUrl = ref('')
const productSplineUrl = ref('')
const productSplineUrl_left = ref('')

onMounted(() => {
    if (!customElements.get('spline-viewer')) {
        const script = document.createElement('script')
        script.type = 'module'
        script.src = 'https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js'
        document.head.appendChild(script)
    }

    productSplineUrl_left.value = 'https://prod.spline.design/SEjq3T9BDlFFvtSq/scene.splinecode'
    backgroundSplineUrl.value = 'https://prod.spline.design/bjmbGB6pqr34HMlz/scene.splinecode'
    productSplineUrl.value = 'https://prod.spline.design/NjfJonbV6bUgMXIW/scene.splinecode'
})
</script>

<style scoped lang="scss">
.container {
    position: relative;
    width: 100vw;
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
</style>
