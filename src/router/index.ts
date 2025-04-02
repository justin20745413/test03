import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import fileupload from '../views/fileupload.vue'
import PracticeArea from '../views/PracticeArea.vue'
import Spline from '../views/Spline.vue'
import Spline1 from '../views/Spline1.vue'
import fishweb from '../views/fishweb.vue'
import imgScrollIntoView from '../views/imgScrollIntoView.vue'
import fireLoading from '../views/fireLoading.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/products',
            name: 'products',
            component: Products
        },
        {
            path: '/fileupload',
            name: 'fileupload',
            component: fileupload
        },
        {
            path: '/practice',
            name: 'practice',
            component: PracticeArea
        },
        {
            path: '/Spline',
            name: 'Spline',
            component: Spline
        },
        {
            path: '/Spline1',
            name: 'Spline1',
            component: Spline1
        },
        {
            path: '/fishweb',
            name: 'fishweb',
            component: fishweb
        },
        {
            path: '/imgScrollIntoView',
            name: 'imgScrollIntoView',
            component: imgScrollIntoView
        },
        {
            path: '/fireLoading',
            name: 'fireLoading',
            component: fireLoading
        }
    ]
})

// After each route change, send a page_view event to Google Analytics
router.afterEach((to) => {
    if ((window as any).gtag) {
        ;(window as any).gtag('event', 'page_view', {
            page_path: to.fullPath,
            page_title: to.meta.title || document.title
        })
    }
})

export default router
