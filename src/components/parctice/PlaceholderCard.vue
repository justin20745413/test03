<template>
    <q-card class="practice-card flex">
        <q-card-section>
            <p>反轉一個字串</p>
            <span>{{ '原始值 : ' + str }}</span
            ><br />
            <span>{{ '反轉字串 : ' + reversedStr }}</span>
        </q-card-section>
        <q-card-section>
            <p>數字陣列求和</p>
            <span>{{ '原始值 : ' + arr }}</span
            ><br />
            <span>{{ '數字陣列求和 : ' + sum }}</span>
        </q-card-section>
        <q-card-section>
            <p class="tw-line">篩選出偶數</p>
            <span>{{ '原始值 : ' + xarr }}</span
            ><br />
            <span>{{ '篩選出偶數 : ' + evenNumbers }}</span>
        </q-card-section>
        <q-card-section>
            <p class="tw-line">從 API 獲取並顯示使用者資料</p>
            <q-input
                filled
                v-model="searchKeyword"
                placeholder="請輸入關鍵字"
                @update:model-value="(value) => searchUser(String(value))"
                class="custom-input"
            ></q-input>
            <div v-if="user.name">
                <span>Name: {{ user.name }}</span
                ><br />
                <span>Email: {{ user.email }}</span>
            </div>
            <div v-else>
                <span>請輸入搜尋關鍵字</span>
            </div>
        </q-card-section>
    </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserData } from '@/services/userApi'

//反轉一個字串
let str = 'hello'
let reversedStr = str.split('').reverse().join('')

//數字陣列求和
let arr = [1, 2, 3, 4]
let sum = arr.reduce((acc, current) => acc + current, 0)

//篩選出偶數
let xarr = [1, 2, 3, 4, 5, 6]
let evenNumbers = xarr.filter((num) => num % 2 === 0)
console.log(evenNumbers)

const user = ref({
    name: '',
    email: ''
})

const searchKeyword = ref('')

onMounted(async () => {})

const searchUser = async (value: string) => {
    if (value.trim()) {
        try {
            const userData = await getUserData()

            const matchedUser = userData.find((user) =>
                user.name.toLowerCase().includes(value.toLowerCase())
            )

            if (matchedUser) {
                user.value = matchedUser // 更新使用者資料
            } else {
                user.value = { name: '', email: '' }
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            user.value = { name: '', email: '' }
        }
    } else {
        user.value = { name: '', email: '' }
    }
}
</script>

<style lang="scss" scoped>
.practice-card {
    background: var(--q-card-bg, #fff);
    border-radius: 8px;
    transition:
        transform 0.2s,
        box-shadow 0.2s;
    color: black;
}
.placeholder-text {
    color: var(--q-secondary);
    font-style: italic;
    text-align: center;
    padding: 2rem;
}
:deep .q-field__native,
.q-placeholder {
    color: black;
}
.custom-input {
    :deep(.q-field__native) {
        color: black !important;
    }
    :deep(.q-field__control) {
        color: black !important;
        background: #c1db83 !important;
    }
}
</style>
