<template>
    <q-layout view="lHh LpR fFf">
        <Header />

        <NavigationDrawer />

        <q-page-container>
            <router-view />
        </q-page-container>

        <BackToTop />
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, provide } from 'vue'
import { useQuasar } from 'quasar'
import BackToTop from './components/BackToTop.vue'
import NavigationDrawer from './layoutTool/NavigationDrawer.vue'
import Header from './layoutTool/Header.vue'

const $q = useQuasar()
const isDark = ref($q.dark.isActive)
const currentTheme = ref('secondary')
const leftDrawerOpen = ref(false)

provide('isDark', isDark)
provide('currentTheme', currentTheme)
provide('leftDrawerOpen', leftDrawerOpen)

const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

provide('toggleLeftDrawer', toggleLeftDrawer)

const toggleDarkMode = () => {
    const currentColor = currentTheme.value
    $q.dark.toggle()
    isDark.value = !isDark.value

    nextTick(() => {
        changeThemeColor(currentColor)
    })
}

provide('toggleDarkMode', toggleDarkMode)

const changeThemeColor = (color: string) => {
    currentTheme.value = color

    console.log('當前模式:', isDark.value ? '暗色' : '亮色')
    console.log('選擇的顏色:', color)

    if (isDark.value) {
        document.documentElement.style.setProperty('--q-primary', `var(--q-${color}-dark)`)
    } else {
        document.documentElement.style.setProperty('--q-primary', `var(--q-${color})`)
    }

    document.documentElement.style.setProperty('--q-primary-dark', `var(--q-${color}-dark)`)

    const header = document.querySelector('.q-header')
    if (header) {
        header.classList.remove('bg-primary', 'bg-secondary', 'bg-accent', 'bg-dark')
        header.classList.add(`bg-${color}`)
    }
}

provide('changeThemeColor', changeThemeColor)

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
body {
    background-color: var(--q-background);
    color: var(--q-text);
    transition:
        background-color 0.3s,
        color 0.3s;
}
</style>
