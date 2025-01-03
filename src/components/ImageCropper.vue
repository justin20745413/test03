<template>
    <div class="image-editor-container">
        <h1 class="text-h4 text-center q-mb-lg">Swiper+vueCropper</h1>

        <!-- 主要顯示區域 -->
        <div class="editor-content" v-if="!showCropper">
            <!-- 主要輪播圖 -->
            <div class="banner-container">
                <div class="bannerSwiper swiper">
                    <div class="swiper-wrapper">
                        <div v-for="(image, index) in images" :key="index" class="swiper-slide">
                            <div class="image-wrapper">
                                <q-img
                                    :src="image"
                                    class="banner-image"
                                    fit="cover"
                                    @error="onImageError"
                                >
                                    <template v-slot:loading>
                                        <div
                                            class="text-center full-width full-height flex flex-center"
                                        >
                                            <q-spinner color="primary" size="3em" />
                                        </div>
                                    </template>
                                </q-img>

                                <!-- 編輯工具欄（已移除編輯按鈕） -->
                                <div class="image-toolbar">
                                    <q-btn
                                        flat
                                        round
                                        color="white"
                                        icon="edit"
                                        class="toolbar-btn edit-btn"
                                        @click="editImage(index)"
                                    >
                                        <q-tooltip>編輯圖片</q-tooltip>
                                    </q-btn>
                                    <q-btn
                                        flat
                                        round
                                        color="white"
                                        icon="delete"
                                        class="toolbar-btn delete-btn"
                                        @click="confirmDelete(index)"
                                    >
                                        <q-tooltip>刪除圖片</q-tooltip>
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 導航按鈕 -->
                    <div class="navigation-buttons">
                        <q-btn round class="nav-btn prev-btn" icon="chevron_left" flat />
                        <q-btn round class="nav-btn next-btn" icon="chevron_right" flat />
                    </div>
                </div>
            </div>

            <!-- 縮圖區域 -->
            <div class="thumbs-container q-mt-md">
                <div class="thumbsSwiper swiper">
                    <div class="swiper-wrapper">
                        <div
                            v-for="(image, index) in images"
                            :key="index"
                            class="swiper-slide thumb-slide"
                        >
                            <q-img :src="image" class="thumb-image" fit="cover" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 上傳按鈕 -->
            <div class="upload-section q-mt-lg">
                <q-btn
                    color="primary"
                    icon="add_photo_alternate"
                    label="新增圖片"
                    @click="triggerFileInput"
                >
                    <input
                        type="file"
                        ref="fileInput"
                        accept="image/*"
                        class="hidden-input"
                        @change="onFileSelected"
                    />
                </q-btn>
            </div>
        </div>

        <!-- 確認刪除對話框 -->
        <q-dialog v-model="showDeleteConfirm">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="warning" color="warning" text-color="white" />
                    <span class="q-ml-sm">確定要刪除這張圖片嗎？</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="取消" color="primary" v-close-popup />
                    <q-btn flat label="刪除" color="negative" v-close-popup @click="deleteImage" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- 新增裁切對話框 -->
        <q-dialog v-model="showCropper" full-width>
            <q-card class="cropper-dialog">
                <q-card-section>
                    <div class="text-h6">裁切圖片</div>
                </q-card-section>

                <q-card-section class="cropper-container">
                    <vue-cropper
                        ref="cropperRef"
                        :img="currentImage"
                        :info="true"
                        :autoCrop="true"
                        @realTime="cropImage"
                    />
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="取消" color="primary" v-close-popup @click="cancelCrop" />
                    <q-btn flat label="確認" color="primary" @click="confirmCrop" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swiper from 'swiper'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

const fileInput = ref()
const showDeleteConfirm = ref(false)
const deleteIndex = ref(-1)
const bannerSwiper = ref<Swiper | null>(null)
const thumbsSwiper = ref<Swiper | null>(null)

const placeholderImage = ref('/placeholder.png')
const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    target.src = placeholderImage.value
}

const images = ref([
    'https://picsum.photos/1000/500/?random=1',
    'https://picsum.photos/1000/500/?random=2',
    'https://picsum.photos/1000/500/?random=3'
])

const showCropper = ref(false)
const currentImage = ref('')
const cropperRef = ref()
const croppedImage = ref('')

const initSwipers = () => {
    if (thumbsSwiper.value) {
        thumbsSwiper.value.destroy()
    }
    if (bannerSwiper.value) {
        bannerSwiper.value.destroy()
    }

    thumbsSwiper.value = new Swiper('.thumbsSwiper', {
        modules: [FreeMode, Navigation],
        spaceBetween: 12,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: {
                slidesPerView: 3,
                spaceBetween: 8
            },
            480: {
                slidesPerView: 4,
                spaceBetween: 10
            },
            768: {
                slidesPerView: 5,
                spaceBetween: 12
            }
        }
    })

    bannerSwiper.value = new Swiper('.bannerSwiper', {
        modules: [Navigation, Thumbs],
        loop: true,
        spaceBetween: 0,
        navigation: {
            nextEl: '.next-btn',
            prevEl: '.prev-btn'
        },
        thumbs: {
            swiper: thumbsSwiper.value
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    })
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const onFileSelected = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            currentImage.value = e.target?.result as string
            showCropper.value = true
        }
        reader.readAsDataURL(file)
    }
    fileInput.value.value = ''
}

const confirmDelete = (index: number) => {
    deleteIndex.value = index
    showDeleteConfirm.value = true
}

const deleteImage = () => {
    if (deleteIndex.value > -1) {
        images.value.splice(deleteIndex.value, 1)
        deleteIndex.value = -1
        // 重新初始化 Swiper
        setTimeout(() => {
            initSwipers()
        }, 100)
    }
}

const cropImage = (data: any) => {
    if (cropperRef.value) {
        cropperRef.value.getCropData((data: string) => {
            croppedImage.value = data
        })
    }
}

const cancelCrop = () => {
    showCropper.value = false
    currentImage.value = ''
    croppedImage.value = ''
    setTimeout(() => {
        initSwipers()
    }, 100)
}

const confirmCrop = () => {
    if (cropperRef.value) {
        // 在確認時獲取裁切後的圖片
        cropperRef.value.getCropData((data: string) => {
            images.value.push(data)
            showCropper.value = false
            currentImage.value = ''
            croppedImage.value = ''

            // 重新初始化 Swiper
            setTimeout(() => {
                initSwipers()
            }, 100)
        })
    }
}

const editImage = (index: number) => {
    currentImage.value = images.value[index]
    showCropper.value = true
}

onMounted(() => {
    initSwipers()
})
</script>

<style lang="scss" scoped>
.image-editor-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: var(--q-warning);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.banner-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #f5f5f5;

    .image-wrapper {
        position: relative;
        aspect-ratio: 16/9;

        &:hover .image-toolbar {
            opacity: 1;
        }
    }

    .banner-image {
        width: 100%;
        height: 100%;
    }

    .image-toolbar {
        position: absolute;
        top: 0;
        right: 0;
        padding: 12px;
        opacity: 0;
        transition: opacity 0.3s ease;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
        width: 100%;
        display: flex;
        justify-content: flex-end;
        gap: 8px;

        .toolbar-btn {
            backdrop-filter: blur(4px);
            background: rgba(255, 255, 255, 0.2);

            &:hover {
                background: rgba(255, 255, 255, 0.4);
            }

            &.delete-btn:hover {
                color: var(--q-warning) !important;
            }

            &.edit-btn:hover {
                color: var(--q-primary) !important;
            }
        }
    }
}

.thumbs-container {
    background: #f5f5f5;
    padding: 12px;
    border-radius: 8px;

    .thumb-slide {
        border-radius: 6px;
        overflow: hidden;
        opacity: 0.6;
        transition: all 0.3s ease;
        cursor: pointer;

        &.swiper-slide-thumb-active {
            opacity: 1;
            transform: scale(1.05);
        }

        .thumb-image {
            aspect-ratio: 16/9;
        }
    }
}

.navigation-buttons {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 1;
    pointer-events: none;

    .nav-btn {
        position: absolute;
        pointer-events: auto;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;

        &:hover {
            background: white;
        }
    }

    .prev-btn {
        left: 16px;
    }

    .next-btn {
        right: 16px;
    }
}

.cropper-dialog {
    background: #fff;
    width: 100%;
    max-width: 1000px;
    margin: 24px;
}

.cropper-container {
    height: 60vh;
    background: #f5f5f5;
}

.hidden-input {
    display: none;
}

@media (max-width: 1024px) {
    .image-editor-container {
        padding: 16px;
    }

    .thumbs-container {
        .thumb-slide {
            width: calc(25% - 8px);
        }
    }
}

@media (max-width: 768px) {
    .image-editor-container {
        padding: 12px;
    }

    .banner-container {
        .image-toolbar {
            opacity: 1;
            background: rgba(0, 0, 0, 0.4);
        }
    }

    .thumbs-container {
        .thumb-slide {
            width: calc(33.33% - 8px);
        }
    }

    .cropper-container {
        height: 40vh;
    }
}

@media (max-width: 480px) {
    .navigation-buttons {
        .nav-btn {
            width: 32px;
            height: 32px;

            &.prev-btn {
                left: 8px;
            }
            &.next-btn {
                right: 8px;
            }
        }
    }

    .thumbs-container {
        padding: 8px;
    }
}
</style>
