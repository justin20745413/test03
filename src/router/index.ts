import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import fileupload from '../views/fileupload.vue'
import PracticeArea from '../views/PracticeArea.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
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
        }
    ]
})

export default router
