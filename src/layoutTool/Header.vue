<template>
    <q-header elevated :class="[isDark ? `bg-dark` : `bg-${currentTheme}`, 'header-shadow']">
        <q-toolbar class="q-px-lg">
            <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />

            <q-toolbar-title class="text-weight-bold">
                <span>{{ t('header.brand.designStudio') }}</span>
            </q-toolbar-title>

            <div class="q-gutter-sm">
                <!-- 語言切換按鈕 -->
                <q-btn round flat :icon="currentLocale === 'zh' ? 'translate' : 'language'">
                    <q-menu>
                        <q-list style="min-width: 150px">
                            <q-item clickable v-close-popup @click="changeLanguage('zh')">
                                <q-item-section avatar>
                                    <q-icon name="flag" />
                                </q-item-section>
                                <q-item-section>{{ t('header.language.chinese') }}</q-item-section>
                                <q-item-section side>
                                    <q-icon
                                        v-if="currentLocale === 'zh'"
                                        name="check"
                                        color="primary"
                                    />
                                </q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="changeLanguage('en')">
                                <q-item-section avatar>
                                    <q-icon name="flag" />
                                </q-item-section>
                                <q-item-section>{{ t('header.language.english') }}</q-item-section>
                                <q-item-section side>
                                    <q-icon
                                        v-if="currentLocale === 'en'"
                                        name="check"
                                        color="primary"
                                    />
                                </q-item-section>
                            </q-item>
                            <q-separator />
                            <p class="text-caption q-pa-sm q-ma-none text-right">
                                {{ t('header.theme.themeOptions') }}
                            </p>
                        </q-list>
                    </q-menu>
                    <q-tooltip>{{
                        currentLocale === 'zh'
                            ? t('header.language.switchToEnglish')
                            : t('header.language.switchToChinese')
                    }}</q-tooltip>
                </q-btn>

                <q-btn round flat icon="palette">
                    <q-menu>
                        <q-list style="min-width: 150px">
                            <q-item clickable v-close-popup @click="changeThemeColor('secondary')">
                                <q-item-section avatar>
                                    <q-icon color="secondary" name="circle" />
                                </q-item-section>
                                <q-item-section>{{ t('header.theme.color1') }}</q-item-section>
                            </q-item>
                            <q-item clickable v-close-popup @click="changeThemeColor('accent')">
                                <q-item-section avatar>
                                    <q-icon color="accent" name="circle" />
                                </q-item-section>
                                <q-item-section>{{ t('header.theme.color2') }}</q-item-section>
                            </q-item>
                            <q-separator />
                            <p class="text-caption q-pa-sm q-ma-none text-right">
                                {{ t('header.theme.themeOptions') }}
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
                    <q-tooltip>{{
                        isDark
                            ? t('header.theme.switchToLightMode')
                            : t('header.theme.switchToDarkMode')
                    }}</q-tooltip>
                </q-btn>
            </div>
        </q-toolbar>
    </q-header>
</template>

<script setup lang="ts">
import { inject, Ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const isDark = inject('isDark') as Ref<boolean>
const currentTheme = inject('currentTheme') as Ref<string>
const toggleLeftDrawer = inject('toggleLeftDrawer') as () => void
const changeThemeColor = inject('changeThemeColor') as (color: string) => void
const toggleDarkMode = inject('toggleDarkMode') as () => void

// 當前語言
const currentLocale = computed(() => locale.value)

// 切換語言函數
const changeLanguage = (lang: string) => {
    locale.value = lang
    // 可選：將語言設定保存到 localStorage
    localStorage.setItem('locale', lang)
}

// 初始化時從 localStorage 讀取語言設定
const initLanguage = () => {
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && (savedLocale === 'zh' || savedLocale === 'en')) {
        locale.value = savedLocale
    }
}

// 組件掛載時初始化語言
initLanguage()
</script>

<style lang="scss">
.header-shadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-header {
    transition: background-color 0.3s ease;
}
</style>
