<template>
    <q-layout view="hHh lpR fFf">
        <q-header
            elevated
            :class="[isDark ? 'bg-dark' : `bg-${currentTheme.value}`, 'header-shadow']"
        >
            <q-toolbar class="q-px-lg">
                <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

                <q-toolbar-title class="text-weight-bold">
                    <span class="text-h6">Design Studio</span>
                </q-toolbar-title>

                <div class="q-gutter-sm">
                    <q-btn round flat icon="palette">
                        <q-menu>
                            <q-list style="min-width: 150px">
                                <q-item
                                    clickable
                                    v-close-popup
                                    @click="changeThemeColor('secondary')"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="secondary" name="circle" />
                                    </q-item-section>
                                    <q-item-section>COLOR 1</q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup @click="changeThemeColor('accent')">
                                    <q-item-section avatar>
                                        <q-icon color="accent" name="circle" />
                                    </q-item-section>
                                    <q-item-section>COLOR 2</q-item-section>
                                </q-item>
                                <q-separator />
                                <p class="text-caption q-pa-sm q-ma-none text-right">
                                    Theme Options
                                </p>
                            </q-list>
                        </q-menu>
                    </q-btn>
                    <q-btn
                        flat
                        round
                        :icon="isDark ? 'dark_mode' : 'light_mode'"
                        @click="toggleDarkMode"
                    >
                        <q-tooltip>{{ isDark ? '切換至亮色模式' : '切換至暗色模式' }}</q-tooltip>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer v-model="leftDrawerOpen" bordered :width="250" :breakpoint="400">
            <q-scroll-area class="fit">
                <q-list padding>
                    <q-item-label header>Navigation</q-item-label>

                    <q-item clickable v-ripple to="/" exact>
                        <q-item-section avatar>
                            <q-icon name="home" />
                        </q-item-section>
                        <q-item-section>Home</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/products">
                        <q-item-section avatar>
                            <q-icon name="shopping_cart" />
                        </q-item-section>
                        <q-item-section>Products</q-item-section>
                    </q-item>

                    <q-separator class="q-my-md" />

                    <q-item-label header>Tools</q-item-label>

                    <q-item clickable v-ripple to="/draggable">
                        <q-item-section avatar>
                            <q-icon name="drag_indicator" />
                        </q-item-section>
                        <q-item-section>Draggable List</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple to="/cropper">
                        <q-item-section avatar>
                            <q-icon name="crop" />
                        </q-item-section>
                        <q-item-section>Image Cropper</q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

        <BackToTop />
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useQuasar } from 'quasar'
import BackToTop from './components/BackToTop.vue'

const $q = useQuasar()
const isDark = ref($q.dark.isActive)
const currentTheme = ref('secondary')
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleDarkMode = () => {
    const currentColor = currentTheme.value
    $q.dark.toggle()
    isDark.value = !isDark.value

    nextTick(() => {
        changeThemeColor(currentColor)
    })
}

const changeThemeColor = (color: string) => {
    currentTheme.value = color

    console.log('当前模式:', isDark.value ? '暗色' : '亮色')
    console.log('选择的颜色:', color)

    if (isDark.value) {
        document.documentElement.style.setProperty('--q-primary', `var(--q-${color}-dark)`)
    } else {
        document.documentElement.style.setProperty('--q-primary', `var(--q-${color})`)
    }

    // 始终设置 primary-dark 变量
    document.documentElement.style.setProperty('--q-primary-dark', `var(--q-${color}-dark)`)

    // 更新 header 类
    const header = document.querySelector('.q-header')
    if (header) {
        header.classList.remove('bg-primary', 'bg-secondary', 'bg-accent', 'bg-dark')
        // 在暗色模式下保持使用选择的颜色，而不是强制使用 bg-dark
        header.classList.add(`bg-${color}`)
    }
}

// 确保在暗色模式切换时重新应用主题色
watch(
    () => $q.dark.isActive,
    (newVal) => {
        isDark.value = newVal
        // 重新应用当前主题色
        changeThemeColor(currentTheme.value)
    },
    { immediate: true }
)

onMounted(() => {
    changeThemeColor(currentTheme.value)
})
</script>

<style lang="scss">
body {
    background-color: var(--q-background);
    color: var(--q-text);
    transition:
        background-color 0.3s,
        color 0.3s;
}

.header-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-drawer {
    background-color: var(--q-background);
}

:root {
    --q-primary: var(--q-secondary);
    --q-primary-dark: var(--q-secondary-dark);
    --q-background: #ffffff;
    --q-text: #000000;
}

.body--dark {
    --q-background: #121212;
    --q-text: #ffffff;
}

// 添加过渡效果使颜色变化更平滑
.q-header {
    transition: background-color 0.3s ease;
}
</style>
