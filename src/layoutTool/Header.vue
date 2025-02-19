<template>
    <q-header elevated :class="[isDark ? 'bg-dark' : `bg-${currentTheme}`, 'header-shadow']">
        <q-toolbar class="q-px-lg">
            <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

            <q-toolbar-title class="text-weight-bold">
                <span class="text-h6"
                    >Design Studio (這是教育練習用勿拿相關圖片資料去進行商業用途)</span
                >
            </q-toolbar-title>

            <div class="q-gutter-sm">
                <q-btn round flat icon="palette">
                    <q-menu>
                        <q-list style="min-width: 150px">
                            <q-item clickable v-close-popup @click="changeThemeColor('secondary')">
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
                            <p class="text-caption q-pa-sm q-ma-none text-right">Theme Options</p>
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
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'

const isDark = inject('isDark') as Ref<boolean>
const currentTheme = inject('currentTheme') as Ref<string>
const toggleLeftDrawer = inject('toggleLeftDrawer') as () => void
const changeThemeColor = inject('changeThemeColor') as (color: string) => void
const toggleDarkMode = inject('toggleDarkMode') as () => void
</script>

<style lang="scss">
.header-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-header {
    transition: background-color 0.3s ease;
}
</style>
