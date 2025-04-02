<template>
    <q-page-container class="practice-container">
        <div class="page-header">
            <h2 class="page-title">程式練習區</h2>
            <p class="page-description">這是一個練習區，您可以在這裡進行各種程式測試和練習。</p>
        </div>

        <!-- 新增 Swiper 區塊 -->
        <swiper
            :modules="modules"
            :slides-per-view="1"
            :space-between="30"
            navigation
            :pagination="{ clickable: true }"
            class="practice-swiper"
        >
            <swiper-slide>
                <!-- 數值轉換區塊 -->
                <NumberConversionCard />
            </swiper-slide>

            <swiper-slide>
                <!-- 預留給新練習區塊的空間 -->
                <PlaceholderCard />
            </swiper-slide>
        </swiper>
    </q-page-container>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import NumberConversionCard from '@/components/parctice/NumberConversionCard.vue'
import PlaceholderCard from '@/components/parctice/PlaceholderCard.vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination]
</script>

<style lang="scss" scoped>
.practice-container {
    margin: 0 auto;
    background: #000;
}

.page-header {
    text-align: center;

    .page-title {
        color: var(--q-primary);
        font-size: 2rem;
    }

    .page-description {
        color: var(--q-secondary);
        font-size: 1.1rem;
    }
}

.practice-swiper {
    position: relative;
    padding: 0 40px;

    :deep(.swiper-button-prev),
    :deep(.swiper-button-next) {
        color: var(--q-negative);
        &:after {
            font-size: 24px;
        }
    }

    :deep(.swiper-pagination) {
        position: relative;
        margin-top: 15px;

        .swiper-pagination-bullet {
            background: var(--q-secondary);
            opacity: 0.5;
            &-active {
                background: var(--q-primary);
                opacity: 1;
            }
        }
    }
}
</style>
