import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import fileupload from '../views/fileupload.vue'
import PracticeArea from '../views/PracticeArea.vue'
import Spline1 from '../views/Spline1.vue'
import SplineBackground from '../views/SplineBackground.vue'
import offset from '../views/offset.vue'
import customImageScroll from '../views/customImageScroll.vue'
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
            path: '/Spline1',
            name: 'Spline1',
            component: Spline1
        },
        {
            path: '/SplineBackground',
            name: 'SplineBackground',
            component: SplineBackground
        },
        {
            path: '/practice',
            name: 'practice',
            component: PracticeArea
        },
        {
            path: '/offset',
            name: 'offset',
            component: offset
        },
        {
            path: '/customImageScroll',
            name: 'customImageScroll',
            component: customImageScroll,
            meta: {
                hideFooter: true
            }
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
