<template>
    <canvas ref="canvas" @mousedown="ignite"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
const particles: Particle[] = []
let windForce = 0 // 風力影響火焰搖擺的強度
let flameCenterX = 0 // 火心漂動 X 軸

// 🔥 火焰粒子類別
class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string
    opacity: number
    blur: number

    constructor(
        x: number,
        y: number,
        size: number,
        color: string,
        speedX: number,
        speedY: number,
        blur: number
    ) {
        this.x = x
        this.y = y
        this.size = size
        this.color = color
        this.speedX = speedX
        this.speedY = speedY
        this.opacity = 1
        this.blur = blur
    }

    update() {
        this.x += this.speedX + windForce * 0.2 // 風力影響
        this.y -= this.speedY * 0.5 // 🔹 **降低火焰上升速度**
        this.opacity -= 0.005 // 🔹 **減少消失速度，讓火焰存活更久**
        this.size *= 0.995 // 🔹 **火焰縮小速度更慢**
    }

    draw() {
        if (!ctx) return
        ctx.globalAlpha = this.opacity
        ctx.shadowBlur = this.blur
        ctx.shadowColor = this.color
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
    }
}

// **產生火焰粒子**
const createParticle = (
    x: number,
    y: number,
    color: string,
    minSize: number,
    maxSize: number,
    blur: number,
    speedY: number
) => {
    const size = Math.random() * (maxSize - minSize) + minSize
    const speedX = (Math.random() - 0.5) * 0.2 // 🔹 **減少橫向擴散**
    particles.push(new Particle(x, y, size, color, speedX, speedY, blur))
}

// **🔥 點擊時產生爆燃效果**
const ignite = (event: MouseEvent) => {
    if (!canvas.value) return
    const mouseX = event.clientX
    const mouseY = event.clientY

    for (let i = 0; i < 50; i++) {
        createParticle(
            mouseX,
            mouseY,
            `rgba(${255 - i * 3}, ${100 + i * 6}, 0, 1)`,
            6,
            14,
            20,
            Math.random() * 1.5 + 0.3 // 🔹 **降低火焰升騰速度**
        )
    }
}

// **🔥 動畫渲染函式**
const animate = () => {
    if (!ctx || !canvas.value) return

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 🌬️ **模擬風力變化**
    windForce = Math.sin(Date.now() * 0.001) * 1.2 // 🔹 **降低風力擺動幅度**

    // 🔥 **火心漂動**
    flameCenterX = canvas.value.width / 2 + Math.sin(Date.now() * 0.001) * 1 // 🔹 **減少火焰心漂動範圍**

    // 🔥 **底層火焰（穩定、圓潤）**
    for (let i = 0; i < 2; i++)
        createParticle(flameCenterX, canvas.value.height - 50, 'rgba(255, 180, 0, 1)', 6, 1, 8, 0.5)
    for (let i = 0; i < 4; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 60,
            'rgba(255, 120, 0, 1)',
            8,
            1,
            10,
            0.6
        )
    for (let i = 0; i < 5; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 70,
            'rgba(255, 80, 0, 1)',
            11,
            1,
            18,
            0.7
        )

    // 🔥 **上層火焰（逐漸縮小、尖銳）**
    for (let i = 0; i < 4; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 90,
            'rgba(255, 60, 0, 0.8)',
            4,
            1,
            15,
            0.8
        )
    for (let i = 0; i < 3; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 110,
            'rgba(200, 50, 0, 0.6)',
            3,
            1,
            20,
            0.9
        )
    for (let i = 0; i < 2; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 130,
            'rgba(150, 30, 0, 0.3)',
            2,
            1,
            300,
            1.0
        )
    for (let i = 0; i < 1; i++)
        createParticle(
            flameCenterX,
            canvas.value.height - 150,
            'rgba(100, 40, 0, 0.2)',
            1,
            1,
            300,
            1.1
        ) // 最尖端消失

    // **更新粒子**
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw()
        if (particles[i].opacity <= 0 || particles[i].size <= 0) {
            particles.splice(i, 1)
        }
    }

    setTimeout(() => requestAnimationFrame(animate), 1) // 🔹 **降低動畫更新頻率，讓火焰更慢**
}

// **初始化 Canvas**
onMounted(() => {
    if (!canvas.value) return
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    ctx = canvas.value.getContext('2d')
    animate()
})

// **停止動畫**
onBeforeUnmount(() => {
    ctx = null
})
</script>

<style scoped>
canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    background: transparent;
}
</style>
