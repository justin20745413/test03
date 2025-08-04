<template>
    <div class="product-carousel">
        <swiper
            v-show="products.length > 0"
            :modules="modules"
            :navigation="{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }"
            :pagination="{
                el: '.swiper-pagination',
                clickable: true
            }"
            :loop="true"
            :speed="500"
            @swiper="onSwiper"
            class="mySwiper"
        >
            <swiper-slide v-for="product in products" :key="product.id">
                <img
                    :src="getImageUrl(product.image)"
                    :alt="product.name"
                    class="carousel-image"
                    @error="onImageError"
                />
                <div class="carousel-caption">
                    <h3>{{ product.name }}</h3>
                    <p>{{ product.price }}</p>
                    <q-btn @click="addToCart(product)" color="primary" class="carousel-btn"
                        >Add to Cart</q-btn
                    >
                </div>
            </swiper-slide>

            <!-- Custom Navigation Buttons -->
            <div class="swiper-button-prev" @click="swiperInstance?.slidePrev()">
                <q-btn icon="chevron_left" flat class="custom-nav-btn"></q-btn>
            </div>
            <div class="swiper-button-next" @click="swiperInstance?.slideNext()">
                <q-btn icon="chevron_right" flat class="custom-nav-btn"></q-btn>
            </div>

            <!-- Custom Pagination -->
            <div class="swiper-pagination"></div>
        </swiper>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.css'
import { useMainStore } from '@/stores'
import { QBtn } from 'quasar'
import type { Swiper as SwiperType } from 'swiper'

const store = useMainStore()
const products = ref(store.products)

// 備用圖片URL
const fallbackImage = 'https://picsum.photos/1000/400/?random=5'

// 獲取圖片URL的函數
const getImageUrl = (imageId: number) => {
    return `https://picsum.photos/1000/400/?random=${imageId}`
}

// 圖片加載錯誤處理
const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = fallbackImage
}

function addToCart(product: { id: number; name: string; price: string }) {
    console.log(`Added ${product.name} to cart`)
}

const modules = [Navigation, Pagination]
const swiperInstance = ref<SwiperType | null>(null)

const onSwiper = (swiper: SwiperType) => {
    swiperInstance.value = swiper
}
onMounted(() => {
    useMainStore()
})
</script>

<style lang="scss" scoped>
.product-carousel {
    width: 100%;
    height: 100%;
    position: relative;
}

.carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-caption {
    position: absolute;
    bottom: 20px;
    left: 20px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
}

.carousel-btn {
    margin-top: 10px;
    color: #fff;
    background-color: var(--q-primary);
    border: none;
    border-radius: 8px;
    padding: 10px;
}

/* Custom Navigation Buttons */
.swiper-button-prev,
.swiper-button-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

.swiper-button-prev {
    left: 10px;
}

.swiper-button-next {
    right: 10px;
}

.custom-nav-btn {
    width: 40px;
    height: 40px;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
}

/* Custom Pagination */
:deep(.swiper-pagination-bullet) {
    background-color: var(--q-primary);
}

:deep(.swiper-pagination-bullet-active) {
    background-color: var(--q-primary);
}

/* 隱藏 Swiper 默認的導航按鈕樣式 */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
    &::after {
        display: none;
    }
    background: none;
    width: auto;
    height: auto;
}
</style>
