<template>
    <div class="tw-mt-10 tw-ml-10">
        <h1>The offset-anchor property</h1>
        <div class="frameDiv">
            <img :key="imageKey" src="https://picsum.photos/300/200/?random=10" alt="fish" />
            <div class="circleDiv" :key="circleKey"></div>
            <svg>
                <path
                    d="M 80 80 C 180 -20 280 180 380 80"
                    fill="none"
                    stroke="gray"
                    stroke-width="2"
                    stroke-dasharray="5,5"
                />
            </svg>
        </div>
        <p>The fish is "anchored" to the path at the right center point of the image element.</p>

        <q-btn @click="restartAnimation" label="Restart Animation" color="primary" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const imageKey = ref(0)
const circleKey = ref(0)

const restartAnimation = () => {
    imageKey.value++
    circleKey.value++
}
</script>

<style lang="scss" scoped>
.frameDiv {
    width: 480px;
    height: 180px;
    margin: 20px;
    position: relative;
    border: solid var(--q-ptext) 1px;
}

.circleDiv {
    border: solid var(--q-primary) 3px;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    offset-path: path('M 80 80 C 180 -20 280 180 380 80');
    animation: moveImg 5s 3;
}

img {
    position: absolute;
    width: 70px;
    z-index: 1;
    opacity: 0.5;
    offset-path: path('M 80 80 C 180 -20 280 180 380 80');
    offset-anchor: right center;
    animation: moveImg 5s 3;
}

svg {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
}

@keyframes moveImg {
    100% {
        offset-distance: 100%;
    }
}
</style>
