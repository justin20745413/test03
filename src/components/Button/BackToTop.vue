<template>
    <div class="back-to-top-container" v-show="showButton">
        <div class="back-to-top" @click="scrollToTop">
            <q-icon name="arrow_upward" size="24px" />
        </div>
        <div class="back-to-top-text">Top</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showButton = ref(false)

const checkScroll = () => {
    showButton.value = window.scrollY > 600
}

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

onMounted(() => {
    window.addEventListener('scroll', checkScroll)
})
onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
})
</script>

<style scoped>
.back-to-top-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    z-index: 99999;
    cursor: pointer;
}

.back-to-top {
    width: 40px;
    height: 40px;
    background: #1976d2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.back-to-top-text {
    color: var(--q-primary);
    font-size: 12px;
    font-weight: bold;
}

.back-to-top:hover {
    background: #1565c0;
    transform: translateY(-2px);
}
</style>
