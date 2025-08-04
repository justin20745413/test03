import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'
import VueScrollTo from 'vue-scrollto'
import { gsap } from 'gsap'
import router from './router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import VueCropper from 'vue-cropper'
import './styles/main.css'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './styles/quasar.scss'

import i18n from './i18n/index'

import App from './App.vue'

const app = createApp(App)

app.use(i18n)

app.component('Swiper', Swiper)
app.component('SwiperSlide', SwiperSlide)
app.component('VueCropper', VueCropper)

app.config.globalProperties.$gsap = gsap

app.use(createPinia())
app.use(router)
app.use(Quasar, {
    plugins: {
        Dialog,
        Notify
    },
    config: {
        notify: {
            position: 'top-right',
            timeout: 2500
        }
    }
})
app.use(VueScrollTo)

app.mount('#app')
