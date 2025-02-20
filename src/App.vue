<template>
    <q-layout view="lHh LpR fff">
        <Header />

        <NavigationDrawer />

        <q-page-container>
            <router-view />
        </q-page-container>

        <Footer />
        <BackToTop />
    </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, provide } from 'vue'
import { useQuasar } from 'quasar'
import BackToTop from './components/Button/BackToTop.vue'
import NavigationDrawer from './layoutTool/NavigationDrawer.vue'
import Header from './layoutTool/Header.vue'
import Footer from './layoutTool/Footer.vue'

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
    transition: all 0.3s ease;
}

.q-header,
.q-footer,
.q-drawer {
    transition: background-color 0.3s ease;
}
</style>
