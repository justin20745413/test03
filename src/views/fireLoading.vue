<template>
    <div class="container">
        <!-- 背景圖片 -->
        <div class="background-image"></div>

        <!-- loading遮罩層 -->
        <div class="loading-overlay" :class="{ burning: startBurning }">
            <!-- 火焰動畫元素 -->
            <div class="fire-container">
                <div class="fire"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FireLoading',
    data() {
        return {
            startBurning: false
        }
    },
    mounted() {
        // 延遲啟動燃燒動畫
        setTimeout(() => {
            this.startBurning = true
        }, 1000)
    }
}
</script>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

.background-image {
    width: 100%;
    height: 100%;
    background-image: url('https://picsum.photos/1920/1080'); /* 使用隨機圖片 */
    background-size: cover;
    background-position: center;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    transition: clip-path 2s ease-in-out;
    clip-path: inset(0 0 0 0);
}

.loading-overlay.burning {
    clip-path: inset(100% 0 0 0);
}

.fire-container {
    position: absolute;
    right: 20px;
    bottom: 0;
    width: 100px;
    height: 100px;
    transform: rotate(180deg);
}

.fire {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at center, #ff4500, #ff6b00 30%, transparent 70%);
    animation: burn 0.5s infinite alternate;
    filter: blur(10px);
}

@keyframes burn {
    from {
        transform: scale(0.8);
        opacity: 0.8;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
