<template>
    <div class="product-carousel">
        <swiper
            v-show="files.length > 0"
            :modules="modules"
            :navigation="{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }"
            :pagination="{
                el: '.swiper-pagination',
                clickable: true
            }"
            :loop="files.length > 1"
            :speed="500"
            :effect="'coverflow'"
            :grabCursor="true"
            :centeredSlides="true"
            :slidesPerView="files.length === 1 ? 1 : 'auto'"
            :coverflowEffect="{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
            }"
            class="mySwiper"
        >
            <swiper-slide v-for="file in files" :key="file.id" class="swiper-slide tw-bg-red-500">
                <div class="slide-content">
                    <img
                        :src="getFileUrl(file.name)"
                        :alt="file.originalName"
                        class="carousel-image"
                        @error="handleImageError"
                    />
                    <div class="carousel-caption">
                        <h3>{{ file.originalName }}</h3>
                        <p>檔案大小: {{ file.size }}</p>
                        <p>上傳者: {{ file.uploader }}</p>
                        <q-btn
                            @click="downloadFile(file.name)"
                            color="primary"
                            class="carousel-btn"
                            icon="download"
                            label="下載"
                        />
                    </div>
                </div>
            </swiper-slide>

            <div class="swiper-button-prev">
                <q-btn icon="chevron_left" flat class="custom-nav-btn"></q-btn>
            </div>
            <div class="swiper-button-next">
                <q-btn icon="chevron_right" flat class="custom-nav-btn"></q-btn>
            </div>
            <div class="swiper-pagination"></div>
        </swiper>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { fileApi, API_BASE_URL } from '@/services/fileApi'
import type { FileData } from '@/types/fileUpload'
import { formatFileSize } from '@/utils/fileSize'

const files = ref<FileData[]>([])
const modules = [Navigation, Pagination, EffectCoverflow]

// 獲取檔案列表
const fetchFiles = async () => {
    try {
        const response = await fileApi.getFiles(1, 7)
        console.log('API 原始響應:', response)

        files.value = response.files.map((file) => ({
            id: file.id,
            name: file.fileName,
            originalName: file.originalName,
            type: file.fileType,
            size: formatFileSize(file.fileSize),
            uploader: file.uploaderName,
            status: file.status,
            uploadDate: file.uploadDate
        }))
    } catch (error) {
        console.error('獲取檔案列表失敗:', error)
    }
}

// 獲取檔案URL
const getFileUrl = (fileName: string) => {
    const url = `${API_BASE_URL}/uploads/${fileName}`
    return url
}

// 下載檔案
const downloadFile = (fileName: string) => {
    window.open(fileApi.downloadFile(fileName), '_blank')
}

// 圖片載入失敗時的處理
const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = 'https://picsum.photos/1000/400'
}

onMounted(() => {
    fetchFiles()
})
</script>

<style lang="scss" scoped>
.product-carousel {
    width: 100%;
    padding: 50px 0;
    background-color: var(--q-dark);
}

.swiper-slide {
    width: 300px;
    height: 400px;
    background-position: center;
    background-size: cover;
    border-radius: 15px;
}

.slide-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
}

.carousel-image {
    width: 80%;
    height: 80%;
    object-fit: contain;
    transition: transform 0.3s ease;
}

.carousel-caption {
    position: absolute;
    bottom: 0;
    border-radius: 15px;
    left: 0;
    right: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    transform: translateY(100%);
    transition: transform 0.3s ease;

    h3 {
        margin: 0;
        font-size: 1.2rem;
        margin-bottom: 8px;
    }

    p {
        margin: 4px 0;
        font-size: 0.9rem;
    }
}

.slide-content:hover {
    .carousel-caption {
        transform: translateY(0);
    }

    .carousel-image {
        transform: scale(1.1);
    }
}

.carousel-btn {
    margin-top: 10px;
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

:deep(.swiper-pagination-bullet) {
    background-color: var(--q-primary);
}

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
