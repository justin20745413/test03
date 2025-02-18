<template>
    <!-- 建立一個容器，讓 Three.js 繪製畫面 -->
    <div ref="sceneContainer" class="scene-container"></div>
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
let particles: THREE.Points // 新增：用於火焰粒子
let animationFrameId: number | null = null // 記錄動畫請求 ID，方便停止動畫

// 新增：用於火焰搖曳的時間變量
let time = 0

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
    renderer.setClearColor(0x000000, 0) // 第二個參數 0 代表透明背景
    sceneContainer.value.appendChild(renderer.domElement) // 🔹 把渲染器放進 HTML

    // 4️⃣ 創建立方體（Cube）
    const geometry = new THREE.BoxGeometry() // 🔸 立方體幾何形狀
    const material = new THREE.MeshStandardMaterial({ color: 0xff1a1a }) // 🔸 材質（紅色）
    cube = new THREE.Mesh(geometry, material) // 🔹 創建網格物件
    scene.add(cube) // 🔹 把立方體加入場景中

    // 新增：創建火焰效果
    const fireGeometry = new THREE.BufferGeometry()
    const fireParticles = 20500
    const positions = new Float32Array(fireParticles * 3)
    const colors = new Float32Array(fireParticles * 3)
    const shapes = new Float32Array(fireParticles) // 新增：用於區分形狀的數組

    for (let i = 0; i < fireParticles * 3; i += 3) {
        const y = Math.random() * 1.5 + 1
        // 根據高度計算三角形的寬度
        const spread = 0.8 * (1 - (y - 1) / 1.5) // 隨高度逐漸縮小的寬度
        positions[i] = (Math.random() - 0.5) * spread // x
        positions[i + 1] = y // y
        positions[i + 2] = (Math.random() - 0.5) * spread // z

        // 設置粒子顏色（從下到上漸變）
        const intensity = (y - 1) / 1.5 // 根據高度計算顏色強度
        colors[i] = 1 // R
        colors[i + 1] = Math.min(0.5, (1 - intensity) * 0.3) // G
        colors[i + 2] = 0 // B

        shapes[i / 3] = Math.random() > 0.5 ? 0 : 1
    }

    fireGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    fireGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    fireGeometry.setAttribute('shape', new THREE.BufferAttribute(shapes, 1))

    // 自定義 Shader Material
    const fireMaterial = new THREE.ShaderMaterial({
        uniforms: {
            size: { value: 0.06 },
            opacity: { value: 0.6 }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float shape;
            varying vec3 vColor;
            varying float vShape;
            uniform float size;
            
            void main() {
                vColor = color;
                vShape = shape;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = size * (300.0 / -mvPosition.z);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vShape;
            uniform float opacity;
            
            void main() {
                vec2 center = gl_PointCoord - vec2(0.5);
                float dist = length(center);
                
                float alpha;
                if (vShape > 0.5) {
                    // 方形
                    alpha = (abs(center.x) <= 0.4 && abs(center.y) <= 0.4) ? opacity : 0.0;
                } else {
                    // 圓形
                    alpha = dist < 0.5 ? opacity : 0.0;
                }
                
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    })

    particles = new THREE.Points(fireGeometry, fireMaterial)
    scene.add(particles)

    // 5️⃣ 添加光源（Directional Light）
    const light = new THREE.DirectionalLight(0xffffff, 1) // 🔹 白色燈光，強度 1
    light.position.set(5, 5, 5) // 🔸 設置光源位置
    scene.add(light) // 🔹 把燈光加入場景

    // 6️⃣ 啟動動畫
    animate()
}

// 🔹 動畫函式（讓立方體旋轉）
function animate() {
    animationFrameId = requestAnimationFrame(animate)
    // 🔸 讓立方體旋轉
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    time += 0.05 // 更新時間變量

    const positions = particles.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
        // 向上移動粒子
        positions[i + 1] += 0.025 + Math.random() * 0.01 // 隨機速度

        // 添加搖曳效果
        const y = positions[i + 1]
        const swayAmount = (8 * (y - 1)) / 1.5 // 越高搖曳越大
        positions[i] += Math.sin(time + i) * 0.003 * swayAmount
        positions[i + 2] += Math.cos(time + i) * 0.003 * swayAmount

        // 如果粒子超出範圍，重置到底部
        if (positions[i + 1] > 2.5) {
            const y = 1 // 底部位置
            const spread = 0.8 * (1 - (y - 2) / 1.5) // 底部最大寬度
            positions[i + 1] = y
            positions[i] = (Math.random() - 0.5) * spread
            positions[i + 2] = (Math.random() - 0.5) * spread
        }
    }
    particles.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
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
    border: 1px solid red;
}
</style>
