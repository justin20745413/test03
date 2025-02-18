<template>
    <!-- 建立一個容器，讓 Three.js 繪製畫面 -->
    <div ref="sceneContainer" class="scene-container"></div>
    {{ animationFrameId }}
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three' // 🔹 引入 Three.js

// 🔸 取得 HTML 容器的參考
const sceneContainer = ref<HTMLDivElement | null>(null)

// 🔸 定義場景、相機、渲染器、立方體
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let cube: THREE.Mesh
let animationFrameId: number | null = null // 記錄動畫請求 ID，方便停止動畫

// 🔹 初始化場景
function initScene() {
    if (!sceneContainer.value) return

    // 1️⃣ 創建場景
    scene = new THREE.Scene()

    // 2️⃣ 創建相機（視角角度、寬高比、近剪裁面、遠剪裁面）
    camera = new THREE.PerspectiveCamera(
        75, // 🔸 視角（75度）
        sceneContainer.value.clientWidth / sceneContainer.value.clientHeight, // 🔸 依照容器大小設置比例
        0.1, // 🔸 最近可見距離
        1000 // 🔸 最遠可見距離
    )
    camera.position.z = 5 // 🔹 把相機往 Z 軸方向移動，讓物件可見

    // 3️⃣ 創建 WebGL 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true }) // 🔸 讓邊緣更平滑
    renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight) // 🔸 設置渲染尺寸
    sceneContainer.value.appendChild(renderer.domElement) // 🔹 把渲染器放進 HTML

    // 4️⃣ 創建立方體（Cube）
    const geometry = new THREE.BoxGeometry() // 🔸 立方體幾何形狀
    const material = new THREE.MeshStandardMaterial({ color: 0xff1a1a }) // 🔸 材質（紅色）
    cube = new THREE.Mesh(geometry, material) // 🔹 創建網格物件
    scene.add(cube) // 🔸 把立方體加入場景中

    // 5️⃣ 添加光源（Directional Light）
    const light = new THREE.DirectionalLight(0xffffff, 1) // 🔹 白色燈光，強度 1
    light.position.set(5, 5, 5) // 🔸 設置光源位置
    scene.add(light) // 🔹 把燈光加入場景

    // 6️⃣ 啟動動畫
    animate()
}

// 🔹 動畫函式（讓立方體旋轉）
function animate() {
    animationFrameId = requestAnimationFrame(animate) // 🔹 持續請求動畫幀數

    // 🔸 讓立方體旋轉
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera) // 🔹 渲染場景
}

// 🔹 Vue 生命週期：當組件掛載時，初始化場景
onMounted(() => {
    initScene()
})

// 🔹 Vue 生命週期：當組件卸載時，停止動畫
onUnmounted(() => {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId) // 🔸 停止動畫
    }
})
</script>

<style scoped>
/* 🔹 設置場景容器的樣式 */
.scene-container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black; /* 🔸 設置背景為黑色 */
    border: 1px solid red;
}
</style>
