<template>
    <div class="marquee-container">
        <div ref="marqueeWrapper" class="marquee-wrapper">
            <div ref="marqueeContent" class="marquee-content">
                <span v-for="index in 2" :key="index" class="marquee-item">
                    {{ text }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const props = withDefaults(
    defineProps<{
        text: string
        speed?: number
    }>(),
    {
        text: '歡迎光臨！Welcome！',
        speed: 10 // 讓它稍微快一點，有電子看板的感覺
    }
)

const marqueeContent = ref<HTMLElement | null>(null)
const marqueeWrapper = ref<HTMLElement | null>(null)
let animation: gsap.core.Tween | null = null

onMounted(() => {
    if (marqueeContent.value && marqueeWrapper.value) {
        const itemWidth = marqueeContent.value.scrollWidth / 2 // 取一半，確保內容完整

        animation = gsap.to(marqueeContent.value, {
            x: -itemWidth,
            duration: props.speed,
            ease: 'linear',
            repeat: -1,
            onRepeat: () => {
                gsap.set(marqueeContent.value, { x: 0 })
            }
        })
    }
})

onUnmounted(() => {
    if (animation) {
        animation.kill()
    }
})
</script>

<style lang="scss" scoped>
.marquee-container {
    width: 100%;
    overflow: hidden;
    background: #000; /* 深色背景更有電子感 */
    padding: 12px 0;
    margin-bottom: 20px;
    border-top: 2px solid #00ffea;
    border-bottom: 2px solid #00ffea;
}

.marquee-wrapper {
    display: flex;
    white-space: nowrap;
    will-change: transform;
}

.marquee-content {
    display: flex;
    will-change: transform;
}

.marquee-item {
    display: inline-block;
    color: #00ffea;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 0 20px;
    text-shadow:
        0 0 5px #00ffea,
        0 0 10px #00ffea,
        0 0 20px #00ffea; /* 霓虹效果 */
    animation: glow 1.5s infinite alternate;
}

/* 讓文字有輕微的呼吸霓虹光 */
@keyframes glow {
    from {
        text-shadow:
            0 0 5px #00ffea,
            0 0 10px #00ffea,
            0 0 20px #00ffea;
    }
    to {
        text-shadow:
            0 0 10px #00ffea,
            0 0 20px #00ffea,
            0 0 30px #00ffea;
    }
}
</style>
