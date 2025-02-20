<template>
    <q-footer elevated :class="[isDark ? `bg-dark` : `bg-${currentTheme}`, 'footer-shadow']">
        <q-toolbar class="q-px-lg">
            <q-toolbar-title class="text-center">
                <div class="text-caption">
                    © {{ new Date().getFullYear() }} Design Studio - 僅供教育學術用途
                </div>
                <div class="text-caption q-mt-xs">
                    本網站內容僅作為學習與研究使用，禁止用於商業用途
                </div>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>

<script setup lang="ts">
import { inject, Ref } from 'vue'

const isDark = inject('isDark') as Ref<boolean>
const currentTheme = inject('currentTheme') as Ref<string>
</script>

<style lang="scss">
.footer-shadow {
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.q-footer {
    transition: background-color 0.3s ease;
}
</style>
