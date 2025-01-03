import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import VueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls }
        }),
        quasar({
            sassVariables: path.resolve(__dirname, './src/styles/quasar-variables.scss')
        }),
        VueDevTools()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/quasar-variables.scss";`
            },
            sass: {
                additionalData: `@import "@/styles/quasar-variables.scss"\n`
            }
        }
    }
})
