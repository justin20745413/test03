<template>
    <q-card class="practice-card">
        <q-card-section>
            <h3 class="section-title">數值轉換示例</h3>
            <div class="example-box">
                <p class="original-value">原始值: {{ originalValue }}</p>
            </div>
        </q-card-section>

        <q-card-section>
            <ul class="explanation">
                <li>
                    parseInt(): 將數值轉換為整數
                    <span class="result-value">{{ parsedIntValue }}</span>
                </li>
                <li>
                    parseFloat(): 將字符串轉換為浮點數
                    <span class="result-value">{{ parsedFloatValue }}</span>
                </li>
                <li>
                    Math.round(): 四捨五入到最接近的整數
                    <span class="result-value">{{ roundedValue }}</span>
                </li>
                <li>
                    Math.floor(): 向下取整(取小於等於該數的最大整數)
                    <span class="result-value">{{ floorValue }}</span>
                </li>
                <li>
                    Math.ceil(): 向上取整(取大於等於該數的最小整數)
                    <span class="result-value">{{ ceilValue }}</span>
                </li>
                <li class="tw-flex tw-items-center tw-gap-2">
                    <q-btn
                        color="secondary"
                        class="tw-pa-1 border"
                        flat
                        @click="generateRandomValue"
                        >生成隨機數</q-btn
                    >
                    <span class="result-value">Math.random(): {{ randomValue }}</span>
                </li>
            </ul>
        </q-card-section>
    </q-card>
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

<style scoped>
.practice-card {
    background: var(--q-card-bg, #fff);
    border-radius: 8px;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
}

.section-title {
    color: var(--q-primary);
    margin-bottom: 1rem;
    font-size: 1.25rem;
}

.result-value {
    color: var(--q-negative);
    margin-left: 10px;
    font-weight: 500;

    &::before {
        content: '🔴';
        margin-right: 5px;
    }
}

.example-box {
    background: var(--q-page-bg);
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
    color: var(--q-primary);
}

.explanation {
    list-style: none;
    padding: 0;
    color: var(--q-primary);

    li {
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
}
</style>
