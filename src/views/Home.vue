<template>
    <div class="q-pa-md">
        <!-- Hero Section -->
        <div class="hero-section q-mb-xl">
            <ProductCarousel class="carousel-container" />
        </div>

        <!-- Main Content -->
        <div class="row q-col-gutter-md">
            <!-- Draggable List Section -->
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-h6 q-mb-md">Draggable List</div>
                        <DraggableList />
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-12 col-md-6">
                <q-card flat bordered class="flex flex-center">
                    <div>
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Progress Image</div>
                            <CssIcon />
                        </q-card-section>
                    </div>
                </q-card>
            </div>

            <!-- Image Cropper Section -->
            <div class="col-12 col-md-6">
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-h6 q-mb-md">Image Editor</div>
                        <ImageCropper />
                    </q-card-section>
                </q-card>
            </div>

            <!-- 添加天氣組件 -->
            <div class="col-12 col-md-6">
                <q-card flat bordered class="weather-widget-container">
                    <WeatherWidget />
                </q-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import ProductCarousel from '@/components/ProductCarousel.vue'
import DraggableList from '@/components/DraggableList.vue'
import ImageCropper from '@/components/ImageCropper.vue'
import CssIcon from '@/components/CssIcon.vue'
import WeatherWidget from '@/components/WeatherWidget.vue'
</script>

<style lang="scss" scoped>
.hero-section {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.carousel-container {
    width: 100%;
}

.q-card {
    transition:
        transform 0.2s,
        box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
}

.weather-widget-container {
    height: 100%;
    min-height: 400px;
}
</style>
