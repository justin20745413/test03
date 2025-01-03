import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
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

import App from './App.vue'

const app = createApp(App)

app.component('Swiper', Swiper)
app.component('SwiperSlide', SwiperSlide)
app.component('VueCropper', VueCropper)

app.config.globalProperties.$gsap = gsap

app.use(createPinia())
app.use(router)
app.use(Quasar)
app.use(VueScrollTo)

app.mount('#app')
