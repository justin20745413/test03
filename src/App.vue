<template>
    <q-layout view="lHh LpR lFf">
        <Header />

        <NavigationDrawer />

        <q-page-container>
            <router-view />
        </q-page-container>

        <Footer v-if="!shouldHideFooter" />
        <BackToTop />
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, provide, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import BackToTop from './components/Button/BackToTop.vue'
import NavigationDrawer from './layoutTool/NavigationDrawer.vue'
import Header from './layoutTool/Header.vue'
import Footer from './layoutTool/Footer.vue'

/**
 * ------------- 狀態管理 -------------
 */
const $q = useQuasar()
const route = useRoute()
const isDark = ref($q.dark.isActive)
const currentTheme = ref('secondary')
const leftDrawerOpen = ref(false)

// 提供全局狀態
provide('isDark', isDark)
provide('currentTheme', currentTheme)
provide('leftDrawerOpen', leftDrawerOpen)

// 計算是否應該隱藏 Footer
const shouldHideFooter = computed(() => {
    return route.meta?.hideFooter === true
})

/**
 * ------------- 功能函數 -------------
 */
// 切換側邊欄
const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
provide('toggleLeftDrawer', toggleLeftDrawer)

// 切換暗色模式
const toggleDarkMode = () => {
    const currentColor = currentTheme.value
    $q.dark.toggle()
    isDark.value = !isDark.value

    nextTick(() => {
        changeThemeColor(currentColor)
    })
}
provide('toggleDarkMode', toggleDarkMode)

// 更改主題色
const changeThemeColor = (color: string) => {
    currentTheme.value = color

    console.log('當前模式:', isDark.value ? '暗色' : '亮色')
    console.log('選擇的顏色:', color)

    // 更新 header 和 footer 的類名
    const header = document.querySelector('.q-header')
    const footer = document.querySelector('.q-footer')
    const themeClasses = ['bg-secondary', 'bg-accent']

    if (header) {
        themeClasses.forEach((cls) => header.classList.remove(cls))
        header.classList.add(`bg-${color}`)
    }

    if (footer) {
        themeClasses.forEach((cls) => footer.classList.remove(cls))
        footer.classList.add(`bg-${color}`)
    }
}
provide('changeThemeColor', changeThemeColor)

/**
 * ------------- 監聽器與生命週期 -------------
 */
// 監聽暗色模式變化
watch(
    () => $q.dark.isActive,
    (newVal) => {
        isDark.value = newVal
        changeThemeColor(currentTheme.value)
    },
    { immediate: true }
)

onMounted(() => {
    changeThemeColor(currentTheme.value)
})
</script>

<style lang="scss">
// 基礎樣式
body {
    background-color: var(--q-background);
    color: var(--q-text);
    transition: all 0.3s ease;
    margin: 0;
    padding: 0;
    min-height: 100vh;
}

// 布局元素過渡效果
.q-header,
.q-footer,
.q-drawer {
    transition: background-color 0.3s ease;
}

// RWD 斷點
// 大螢幕 (1200px 以上)
@media (min-width: 1200px) {
    .container {
        max-width: 1140px;
        margin: 0 auto;
    }
}

// 中等螢幕 (992px - 1199px)
@media (min-width: 992px) and (max-width: 1199px) {
    .container {
        max-width: 960px;
        margin: 0 auto;
    }
}

// 平板 (768px - 991px)
@media (min-width: 768px) and (max-width: 991px) {
    .container {
        max-width: 720px;
        margin: 0 auto;
    }
}

// 大手機 (576px - 767px)
@media (min-width: 576px) and (max-width: 767px) {
    .container {
        max-width: 540px;
        margin: 0 auto;
    }
}

// 小手機 (576px 以下)
@media (max-width: 575px) {
    .container {
        width: 100%;
        padding: 0 15px;
    }
}

// 通用 RWD 輔助類
.hide-on-small {
    @media (max-width: 767px) {
        display: none !important;
    }
}

.hide-on-medium {
    @media (min-width: 768px) and (max-width: 991px) {
        display: none !important;
    }
}

.hide-on-large {
    @media (min-width: 992px) {
        display: none !important;
    }
}

.text-responsive {
    font-size: 1rem;

    @media (max-width: 767px) {
        font-size: 0.875rem;
    }
}

// 響應式間距
.responsive-padding {
    padding: 2rem;

    @media (max-width: 991px) {
        padding: 1.5rem;
    }

    @media (max-width: 767px) {
        padding: 1rem;
    }
}

.responsive-margin {
    margin: 2rem;

    @media (max-width: 991px) {
        margin: 1.5rem;
    }

    @media (max-width: 767px) {
        margin: 1rem;
    }
}

// 響應式網格系統
.grid {
    display: grid;
    gap: 1rem;

    &.cols-4 {
        grid-template-columns: repeat(4, 1fr);

        @media (max-width: 991px) {
            grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 575px) {
            grid-template-columns: 1fr;
        }
    }

    &.cols-3 {
        grid-template-columns: repeat(3, 1fr);

        @media (max-width: 767px) {
            grid-template-columns: 1fr;
        }
    }

    &.cols-2 {
        grid-template-columns: repeat(2, 1fr);

        @media (max-width: 575px) {
            grid-template-columns: 1fr;
        }
    }
}
</style>
