<template>
    <div class="">
        <p class="practice-area">這是一個空白的練習區，您可以在這裡進行任何測試或練習。</p>
        <div class="border tw-flex-col">
            <p>數值轉換示例</p>
            <div class="example-box">
                <p>原始值: {{ originalValue }}</p>
            </div>
        </div>
        <div class="border tw-flex-col mt-4">
            <p>說明:</p>
            <ul class="explanation">
                <li>
                    parseInt(): 將數值轉換為整數<span class="tw-text-red-500"
                        >parseInt(): {{ parsedIntValue }}</span
                    >
                </li>
                <li>
                    parseFloat(): 將字符串轉換為浮點數<span class="tw-text-red-500"
                        >parseFloat(): {{ parsedFloatValue }}</span
                    >
                </li>
                <li>
                    Math.round(): 四捨五入到最接近的整數<span class="tw-text-red-500"
                        >Math.round(): {{ roundedValue }}</span
                    >
                </li>
                <li>
                    Math.floor(): 向下取整(取小於等於該數的最大整數)<span class="tw-text-red-500"
                        >Math.floor(): {{ floorValue }}</span
                    >
                </li>
                <li>
                    Math.ceil(): 向上取整(取大於等於該數的最小整數)<span class="tw-text-red-500"
                        >Math.ceil(): {{ ceilValue }}</span
                    >
                </li>
                <li class="tw-flex tw-items-center tw-gap-2">
                    <q-btn
                        color="secondary"
                        class="tw-pa-1 border"
                        flat
                        @click="generateRandomValue"
                        >生成隨機數</q-btn
                    >
                    <span class="tw-text-red-500">Math.random(): {{ randomValue }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const originalValue = ref(12.67)

const parsedIntValue = computed(() => {
    return parseInt(originalValue.value.toString())
})

const parsedFloatValue = computed(() => {
    return parseFloat(originalValue.value.toString())
})

const roundedValue = computed(() => {
    return Math.round(originalValue.value)
})

const floorValue = computed(() => {
    return Math.floor(originalValue.value)
})

const ceilValue = computed(() => {
    return Math.ceil(originalValue.value)
})

const randomValue = ref(Math.random())

const generateRandomValue = () => {
    randomValue.value = Math.random()
}
</script>

<style lang="scss" scoped>
.practice-area {
    padding: 20px;
    text-align: center;
}
.border {
    border: 1px solid var(--q-ptext);
}
.dark-mode .border {
    border: 1px solid var(--q-ptext-dark);
}
.example-box {
    margin: 10px 0;
}
.explanation {
    text-align: left;
    padding-left: 20px;
}
.mt-4 {
    margin-top: 1rem;
}
.tw-text-red-500 {
    color: red;
    margin-left: 10px;
}
.tw-text-red-500::before {
    content: '🔴';
    margin-right: 5px;
}
</style>
