<template>
    <h1 v-show="burnedOncePhase2" class="main-title">LOVE TAIWAN.</h1>
    <h2 v-show="burnedOncePhase2" class="main-title2">
        Taiwan's Splendor: <br />A Symphony of Nature and Life
    </h2>
    <div class="container">
        <!-- 添加標題元素 -->

        <!-- 添加開始頁面 -->
        <div v-if="!started" class="start-page">
            <p><q-icon name="local_fire_department" /> 燃燒動畫效果</p>
            <span
                >點擊下方按鈕，體驗真實的燃燒效果！隨著火焰蔓延，白色紙張逐漸消失，隱藏於底層的畫面將神秘浮現。每一次燃燒的路徑都是獨特的，營造出視覺震撼的交錯感。感受火焰的魅力，探索光與影的變化，創造屬於你的獨特體驗！</span
            >
            <button class="start-btn" @click="handleStart">Start</button>
        </div>

        <!-- 原有內容 -->
        <div v-if="phase === 1 && started" class="loading-container">
            <div class="loading"></div>
        </div>
        <canvas ref="canvasRef" v-show="started"></canvas>

        <!-- 燃燒完成後顯示的組件 -->
        <div v-if="showComponents" class="components-container">
            <CssIcon class="component-item" />
            <ProductCarousel class="component-item" />
            <WeatherWidget class="tw-min-w-[77rem]" />
            <DraggableList class="component-item" />
            <AnimatedButton />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// 添加組件引用
import CssIcon from '@/components/CssIcon.vue'
import DraggableList from '@/components/DraggableList.vue'
import ProductCarousel from '@/components/ProductCarousel.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
import AnimatedButton from '@/components/animatedButton.vue'

/**
 * ------------- 變數區 -------------
 */
const canvasRef = ref(null)
let canvas = null
let ctx = null
let animationFrameId = null

// 分階段燃燒控制：1 => 燃燒圖形內, 2 => 燃燒圖形外
const phase = ref(1)
let burnedOncePhase1 = false
const burnedOncePhase2 = ref(false)

// 兩張用來做「燃燒後切換」的圖 (白圖 / 黑圖)
let img1, img2

// mapData: 存每個像素的燃燒資料
let mapData = []

// shapeMask: 用於標示「是否屬於圖形內」
let shapeMask = []

// 添加背景圖片相關變數
const bgImage = ref(null)

// 添加開始狀態控制
const started = ref(false)

// 添加組件顯示控制
const showComponents = ref(false)

/**
 * 兩組不同的「燃燒參數」
 * -------------------------
 * 你可以改成任何你想要的數值；下方程式會依照階段切換。
 */
const stepOneSettings = reactive({
    Burns: 5, // 增加起火點數量
    Color: true,
    burnColor: '#FFFFFF',
    baseSpeed: 1, // 提高基礎速度
    speedVariation: 1, // 速度變化
    randomSize: 40 // 減少隨機大小範圍，使燃燒更快開始
})
const stepTwoSettings = reactive({
    Burns: 16, // 增加起火點數量
    Color: true,
    burnColor: '#FFFFFF',
    baseSpeed: 6, // 提高基礎速度
    speedVariation: 20, // 增加速度變化
    randomSize: 60 // 減少隨機大小範圍，使燃燒更快開始
})

/**
 * ------------- 工具函式區 -------------
 */
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '')

    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((x) => x + x)
            .join('')
    }

    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return { r, g, b }
}

function createWhiteImage(w, h) {
    const tempCanvas = document.createElement('canvas')

    tempCanvas.width = w
    tempCanvas.height = h
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.fillStyle = '#fff'
    tempCtx.fillRect(0, 0, w, h)

    return tempCanvas.toDataURL()
}

function createBlackImage(w, h) {
    const tempCanvas = document.createElement('canvas')

    tempCanvas.width = w
    tempCanvas.height = h
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.fillStyle = '#000'
    tempCtx.fillRect(0, 0, w, h)

    return tempCanvas.toDataURL()
}

/**
 * createShapeMask():
 * taiwan maps
 * 這裡示範用 Path2D 繪製一個 SVG path 並放在正中央
 * 你可以直接換成任何 path 或改寫成圓形 / 方形都可以
 */
function createShapeMask(width, height) {
    const offCanvas = document.createElement('canvas')

    offCanvas.width = width
    offCanvas.height = height
    const offCtx = offCanvas.getContext('2d')

    // 1) 先整塊塗黑 (代表圖形外)
    offCtx.fillStyle = '#000'
    offCtx.fillRect(0, 0, width, height)

    // 2) 你的 SVG path (假設原始寬約 40, 高約 78)
    //   中心點約 (21,40)。只平移到正中央，不縮放。
    const svgPathString =
        'M12.2021 67.5918C7.82955 65.4693 6.02464 62.3741 5.66875 61.0918L5.4 60.5612V59.6327L4.86667 58.8367V58.3061V57.9082L4.33333 57.2449L3.53333 55.7857L3.13333 54.9898V53.7959L2.2 53.1327L1 52.3367V51.8061L1.4 51.4082L1.66667 50.2143V49.8163L2.2 48.3571L2.6 47.8265V46.7653V45.7041V43.9796V42.3878V40.7959L3.13333 38.9388L3.53333 38.0102V37.4796L4.06667 36.551C4.28889 36.0204 4.76 34.8531 4.86667 34.4286C5 33.898 5.4 33.5 5.8 33.102C6.2 32.7041 6.06667 32.4388 6.33333 32.1735C6.54667 31.9612 6.86667 31.466 7 31.2449C7.53333 30.4048 8.6 28.6714 8.6 28.4592C8.6 28.1939 9.26667 27.398 9.66667 26.7347C9.98667 26.2041 10.4222 25.0986 10.6 24.6122C10.8667 24.2143 11.72 22.9673 13 21.1633C13.6966 20.1815 13.9246 19.9147 13.9376 19.961L14.0667 19.7041C14.1733 19.4918 14.4667 18.9966 14.6 18.7755C14.8667 18.4218 15.4533 17.7143 15.6667 17.7143C15.88 17.7143 16.8222 16.3878 17.2667 15.7245L18.0667 14.1327C18.7333 13.1599 20.1733 11.0551 20.6 10.4184C21.1333 9.62245 21 10.0204 21.2667 9.4898C21.5333 8.95918 22.3333 8.29592 22.7333 7.5C23.1333 6.70408 24.0667 6.43878 24.6 6.43878C25.0267 6.43878 25.4889 5.90816 25.6667 5.64286C25.9778 5.46599 26.7867 5.05918 27.5333 4.84694C27.8 4.84694 28.0667 4.84694 28.4667 4.44898C28.8667 4.05102 29.4 4.18367 29.8 3.78571C30.2 3.38775 30.3333 2.9898 30.8667 2.45918L31.4 1.92857H31.8H32.2L33.3687 1.02419C33.3784 1.01639 33.3888 1.00833 33.4 1L33.3687 1.02419C32.9154 1.38926 34.0489 1.19015 34.4667 1.39796C34.8933 1.6102 34.9111 1.84014 34.8667 1.92857L35.1333 2.45918C35.4 2.45918 36.0933 2.56531 36.7333 2.9898C37.1333 3.2551 37.5333 3.52041 37.5333 3.78571C37.5333 4.05102 38.0667 3.91837 38.2 4.18367C38.3333 4.44898 39 4.44898 39.8 4.44898C40.3333 4.44898 40.3333 4.58163 40.7333 4.84694C41.0533 5.05918 41.1333 4.93537 41.1333 4.84694L41.4 5.11224V6.04082V6.43878L41.9333 7.10204H42.7333L43 7.5V7.89796C42.7333 7.98639 42.1467 8.1898 41.9333 8.29592C41.72 8.40204 40.6889 9.13605 40.2 9.4898L39.2667 10.4184L39 11.2143C39 11.3469 38.8933 11.7449 38.4667 12.2755C37.9333 12.9388 38.4667 13.3367 39 13.7347C39.5333 14.1327 39 14.1327 39.2667 14.5306C39.5333 14.9286 39.8 15.1939 39.8 15.7245V16.5204C39.8 16.7857 39.8 17.051 40.2 17.7143C40.6 18.3776 39.9333 18.9082 39.8 19.3061C39.6667 19.7041 39.2667 20.102 39 20.5C38.7333 20.898 38.6 20.898 38.4667 21.1633C38.3333 21.4286 38.0667 22.0918 38.0667 22.4898C38.0667 22.8878 38.2 23.0204 38.0667 23.4184C37.96 23.7367 37.6667 24.3469 37.5333 24.6122C37.3111 24.8333 36.84 25.3551 36.7333 25.6735C36.6267 25.9918 36.5111 25.983 36.4667 25.9388V26.4694L36.3333 26.7347L35.9333 27.398L35.1333 28.0612V29.5204V30.7143V31.5102C35.1778 31.8197 35.24 32.5184 35.1333 32.8367C35.0267 33.1551 34.9111 33.6769 34.8667 33.898C34.7778 34.0748 34.5733 34.5347 34.4667 34.9592C34.3333 35.4898 33.6667 36.2857 33.4 37.0816C33.1333 37.8775 32.7333 38.4082 32.4667 38.9388C32.2 39.4694 32.2 39.602 32.2 40V41.4592V43.449V44.6429V45.3061L31.4 46.3673V46.7653L30.8667 47.4286L30.3333 49.0204C30.2 49.4626 29.9333 50.5857 29.9333 51.5408C29.9333 52.0714 29.6667 52.0714 29.5333 52.3367C29.4267 52.549 29.1333 52.9558 29 53.1327C28.9111 53.2653 28.7067 53.5837 28.6 53.7959C28.4667 54.0612 28.3333 54.7245 28.0667 54.9898C27.8 55.2551 27.8 55.5204 27.6667 55.7857C27.5333 56.051 27.5333 56.1837 27.4 56.449C27.2667 56.7143 27.1333 56.9796 26.7333 57.5102C26.4133 57.9347 26.6 57.9524 26.7333 57.9082L25.2667 59.5L24.7333 60.1633H24.3333L23.8 60.5612C23.5333 60.7381 22.9733 61.1714 22.8667 61.4898C22.7333 61.8878 22.3333 62.0204 22.3333 62.4184C22.3333 62.8163 21.8 63.0816 21.6667 63.4796C21.5333 63.8775 20.8667 65.2041 20.8667 65.602C20.8667 66 20.4667 66.2653 20.4667 66.5306C20.4667 66.7959 19.8 67.5918 19.8 67.9898V68.7857V70.1122C19.8 70.3775 19.5333 71.9694 19.5333 72.7653C19.5333 73.5612 19.5333 73.2959 19.8 74.6224C20.0667 75.949 19.8 75.1531 19.8 75.551V76.0816V76.6122C19.3556 76.8775 18.4933 77.4878 18.6 77.8061C18.7067 78.1245 18.2889 78.7347 18.0667 79V78.602H17.6667L17.2667 78.3367V77.8061C17.1333 77.7177 16.8133 77.5939 16.6 77.8061C16.3867 78.0184 16.5111 78.1599 16.6 78.2041L16.3333 78.602H15.9333L15.6667 78.3367V77.4082L15.1333 76.0816C15.1778 75.7721 15.24 74.5694 15.1333 72.2347C15.0267 69.9 13.1347 68.1667 12.2021 67.5918Z'
    const svgPath = new Path2D(svgPathString)
    const shapeCenterX = 21
    const shapeCenterY = 40

    // 移到畫布正中央
    offCtx.save()
    offCtx.translate(width / 2 - shapeCenterX, height / 2 - shapeCenterY)
    offCtx.fillStyle = '#fff'
    offCtx.fill(svgPath)
    offCtx.restore()

    // 3) 讀取像素資料 -> 白色 => inShape = true
    const imageData = offCtx.getImageData(0, 0, width, height)
    const data = imageData.data

    const mask = []

    for (let x = 0; x < width; x++) {
        mask[x] = []

        for (let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4
            const isWhite = data[idx] > 200 && data[idx + 1] > 200 && data[idx + 2] > 200

            mask[x][y] = isWhite
        }
    }

    return mask
}

/**
 * ------------- 初始化相關 -------------
 */
function setupCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

/**
 * initMapData():
 * 第一次只初始化「圖形內」區域：給它的 val/speed 基於第一階段設定；
 * 「圖形外」先給一個無意義的大值(等於還沒真正初始化)，以免第一階段會去影響外圍。
 */
function initMapData() {
    const width = canvas.width
    const height = canvas.height

    shapeMask = createShapeMask(width, height)

    mapData = []

    for (let x = 0; x < width; x++) {
        mapData[x] = []

        for (let y = 0; y < height; y++) {
            const inShape = shapeMask[x][y]

            if (inShape) {
                // 第一階段 => 用 stepOneSettings
                mapData[x][y] = {
                    val: 1 + Math.floor(Math.random() * stepOneSettings.randomSize),
                    neighbors: true,
                    speed:
                        stepOneSettings.baseSpeed + Math.random() * stepOneSettings.speedVariation,
                    inShape
                }
            } else {
                // 外圍先設成一個很大的 val、speed=0，
                // 等到「第二階段」再來正式初始化(覆蓋)。
                mapData[x][y] = {
                    val: 999999, // 或任意大數，避免第一階段無意間把外圍也燒了
                    neighbors: true,
                    speed: 0,
                    inShape
                }
            }
        }
    }
}

/**
 * prepareOutsideForPhase2():
 * 在第一階段完成後，才把「圖形外」區域的 val / speed 改用 stepTwoSettings，
 * 好讓第二階段可以正確地燃燒外圍。
 */
function prepareOutsideForPhase2() {
    const width = canvas.width
    const height = canvas.height

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (!shapeMask[x][y]) {
                // 外圍 => 使用 stepTwoSettings 初始化
                mapData[x][y].val = 1 + Math.floor(Math.random() * stepTwoSettings.randomSize)
                mapData[x][y].speed =
                    stepTwoSettings.baseSpeed + Math.random() * stepTwoSettings.speedVariation
                mapData[x][y].neighbors = true
            }
        }
    }
}

/**
 * initBurningPhase(inShape):
 * 依照當前 phase，取得對應的 settings，然後在指定的區域投放火種。
 */
function initBurningPhase(inShape = true) {
    const width = canvas.width
    const height = canvas.height

    // 看目前 phase，拿對應的設定
    const currentSettings = phase.value === 1 ? stepOneSettings : stepTwoSettings

    for (let i = 0; i < currentSettings.Burns; i++) {
        let randX, randY

        while (true) {
            randX = Math.floor(Math.random() * width)
            randY = Math.floor(Math.random() * height)

            if (shapeMask[randX][randY] === inShape) {
                break
            }
        }
        // 起火點 => val=0 => 立即燃燒
        mapData[randX][randY].val = 0
    }
}

/**
 * ------------- 燃燒核心邏輯 -------------
 */
function burnEdges(x, y, data) {
    // 依照當前階段，使用對應的參數
    const isPhaseOne = phase.value === 1
    const s = isPhaseOne ? stepOneSettings : stepTwoSettings

    let neighbors = false

    // 檢查周圍 8 個相鄰像素
    for (let xx = x - 1; xx <= x + 1; xx++) {
        for (let yy = y - 1; yy <= y + 1; yy++) {
            if (
                !(xx === x && yy === y) && // 排除自己
                xx >= 0 &&
                xx < canvas.width &&
                yy >= 0 &&
                yy < canvas.height
            ) {
                if (mapData[xx][yy].val > 0) {
                    neighbors = true
                    // 按照該像素本身的 speed 來遞減值
                    mapData[xx][yy].val -= mapData[xx][yy].speed
                }
            }
        }
    }

    // 更新是否還有未燒完的鄰居
    mapData[x][y].neighbors = neighbors
}

/**
 * ------------- 渲染相關函數 -------------
 */
function render() {
    const width = canvas.width
    const height = canvas.height

    // 清除畫布
    ctx.clearRect(0, 0, width, height)

    // 先填充白色背景，而不是繪製背景圖
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, width, height)

    // 取得當前階段的設定
    const currentSettings = phase.value === 1 ? stepOneSettings : stepTwoSettings

    // 創建 ImageData 來繪製燃燒效果
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    // 遍歷每個像素
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const idx = (x + y * width) * 4
            const pixel = mapData[x][y]

            if (pixel.val <= 0) {
                // 已經燒完的像素 - 完全透明
                data[idx] = 0 // 改為白色
                data[idx + 1] = 0
                data[idx + 2] = 0
                data[idx + 3] = 0 //透明

                if (pixel.neighbors) {
                    burnEdges(x, y, data)
                }
            } else if (pixel.val < 100) {
                // 正在燃燒的像素
                if (currentSettings.Color) {
                    const color = hexToRgb(currentSettings.burnColor)
                    data[idx] = color.r
                    data[idx + 1] = color.g
                    data[idx + 2] = color.b
                    data[idx + 3] = 255 // 完全不透明
                } else {
                    data[idx] = 255
                    data[idx + 1] = 255
                    data[idx + 2] = 255
                    data[idx + 3] = 255
                }
            } else {
                // 未燃燒的像素 - 黑色不透明
                data[idx] = 0 // 改為黑色
                data[idx + 1] = 0
                data[idx + 2] = 0
                data[idx + 3] = 255 // 完全不透明
            }
        }
    }

    // 將處理後的圖像資料繪製到畫布上
    ctx.putImageData(imageData, 0, 0)

    // 檢查燃燒階段
    checkBurningPhase()

    // 繼續動畫循環
    animationFrameId = requestAnimationFrame(render)
}

/**
 * 檢查燃燒階段並控制轉換
 */
function checkBurningPhase() {
    const width = canvas.width
    const height = canvas.height
    let unburned = false

    // 檢查當前階段是否還有未燒完的像素
    for (let x = 0; x < width && !unburned; x++) {
        for (let y = 0; y < height && !unburned; y++) {
            const pixel = mapData[x][y]
            if (
                ((phase.value === 1 && pixel.inShape) || (phase.value === 2 && !pixel.inShape)) &&
                pixel.val > 0 &&
                pixel.val < 999999
            ) {
                unburned = true
            }
        }
    }

    // 階段轉換控制
    if (!unburned) {
        if (phase.value === 1 && !burnedOncePhase1) {
            // 第一階段完成，準備第二階段
            burnedOncePhase1 = true
            phase.value = 2
            prepareOutsideForPhase2()
            initBurningPhase(false)
        } else if (phase.value === 2 && !burnedOncePhase2.value) {
            // 第二階段完成
            burnedOncePhase2.value = true
            showComponents.value = true
            cancelAnimationFrame(animationFrameId)

            // 燃燒完成後只解鎖 Y 軸滾動
            document.body.style.overflowY = 'auto'
            document.body.style.overflowX = 'hidden'
        }
    }
}

// 添加開始按鈕處理函數
function handleStart() {
    started.value = true
    // 等待下一幀再初始化，確保 canvas 已經顯示
    requestAnimationFrame(() => {
        setupCanvas()
        initMapData()
        initBurningPhase(true)
        render()
    })
}

/**
 * ------------- 初始化和啟動 -------------
 */
onMounted(() => {
    canvas = canvasRef.value
    ctx = canvas.getContext('2d')

    // 一開始就鎖住 X 和 Y 軸滾動
    document.body.style.overflow = 'hidden'

    // 加載背景圖
    bgImage.value = new Image()
    bgImage.value.src = new URL('@/assets/bg-fire.jpg', import.meta.url).href
})

// 清理
onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
    document.body.style.overflow = ''
})
</script>

<style scoped>
.container {
    position: relative;
    width: 100vw;
    height: 100vh;
}

canvas {
    position: absolute;
    background: url('@/assets/bg-fire.jpg') no-repeat center center;
    background-size: cover;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
}

.loading {
    width: fit-content;
    font-size: 40px;
    font-family: system-ui, sans-serif;
    font-weight: bold;
    text-transform: uppercase;
    color: #0000;
    -webkit-text-stroke: 1px #fff;
    background: linear-gradient(90deg, #0000 33%, #fff 0 67%, #0000 0) 0/300% 100% no-repeat text;
    animation: l2 2s linear infinite;
}

.loading:before {
    content: 'Loading';
}

@keyframes l2 {
    0% {
        background-position: 100%;
    }
}

@media (min-width: 1530px) {
    .icon-container {
        grid-template-columns: repeat(6, 1fr);
        gap: 19px;
        padding: 20px;
    }
}

@media (max-width: 1530px) {
    .icon-container {
        gap: 64px;
        padding: 16px;
    }

    .Battery {
        width: 60px;
        height: 30px;
    }

    .water {
        width: 50px;
    }

    .triangle {
        width: 60px;
    }

    .water_droplets {
        width: 80px;
    }

    .square {
        width: 50px;
    }

    .loading {
        font-size: 32px;
    }
}

@media (max-width: 768px) {
    .main-title {
        font-size: 3rem;
    }
    .main-title2 {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .icon-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 12px;
    }

    .Battery {
        width: 50px;
        height: 25px;
    }

    .water {
        width: 40px;
    }

    .triangle {
        width: 50px;
    }

    .water_droplets {
        width: 60px;
    }

    .square {
        width: 40px;
    }

    .loading {
        font-size: 24px;
    }

    .main-title {
        font-size: 2rem;
    }
    .main-title2 {
        font-size: 1rem;
    }
}

/* 添加開始頁面樣式 */
.start-page {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    z-index: 1000;
}

.start-page p {
    font-size: 1.2rem;
    color: var(--q-primary);
}
.start-page span {
    font-size: 1.2rem;
    color: var(--q-primary);
    line-height: 1.5;
    width: 25%;
    flex-wrap: wrap;
    margin-bottom: 1rem;
    background: #ffffff;
    padding: 1rem;
    border-radius: 1rem;
}

.start-btn {
    padding: 0.2rem 1rem;
    font-size: 1.5rem;
    background-color: #ffffff;
    color: #000000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.2s;
}

.start-btn:hover {
    transform: scale(1.05);
}

/* 添加標題樣式 */
.main-title {
    position: absolute;
    top: 50%;
    left: 48%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 5rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
    opacity: 0;
    animation: fadeIn 1s ease-in forwards;
    pointer-events: none;
}
.main-title2 {
    position: absolute;
    top: 63%;
    left: 50%;
    right: 5%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 3rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    z-index: 1;
    opacity: 0;
    animation: fadeIn 1s ease-in forwards;
    pointer-events: none;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.components-container {
    position: absolute;
    top: 100vh;
    left: 0;
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    opacity: 0;
    animation: fadeIn 1s ease forwards;
    animation-delay: 0.5s;
    background-color: var(--q-background);
}

.component-item {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background: white;
    overflow: hidden;
    padding: 20px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .components-container {
        padding: 10px;
        gap: 20px;
    }
}

/* 確保整個容器填滿視窗且不會出現滾動條 */
.fire-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
}
</style>
