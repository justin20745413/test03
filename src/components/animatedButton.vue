<template>
    <button ref="btn" class="animated-btn">滑鼠來試試</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const btn = ref(null)

onMounted(() => {
    gsap.fromTo(
        btn.value,
        { scale: 1 },
        { scale: 1.2, duration: 0.3, repeat: -1, yoyo: true, ease: 'power1.inOut' }
    )
})
</script>

<style scoped>
.animated-btn {
    background: #ff5733;
    border: none;
    color: white;
    font-size: 20px;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
}
</style>
