<template>
    <div class="q-pa-md">
        <!-- 添加跑馬燈 -->
        <MarqueeText
            text="歡迎光臨！Welcome！いらっしゃいませ！ 歡迎光臨！Welcome！いらっしゃいませ！"
            :speed="12"
        />

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
                <q-card flat bordered class="flex flex-start tw-mt-4">
                    <div>
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Progress Image</div>
                            <CssIcon />
                        </q-card-section>
                    </div>
                </q-card>
                <q-card flat bordered class="tw-mt-4">
                    <q-card-section>
                        <div class="text-h6 q-mb-md">Image Editor</div>
                        <ImageCropper />
                    </q-card-section>
                </q-card>
            </div>

            <div class="col-12 col-md-6">
                <!-- 添加天氣組件 -->
                <q-card flat bordered>
                    <q-card-section>
                        <div class="text-h6 q-mb-md">Weather</div>
                        <WeatherWidget />
                    </q-card-section>
                </q-card>
                <!-- 添加Picturebox組件 -->
                <q-card flat bordered class="tw-mt-4">
                    <q-card-section>
                        <div class="text-h6 q-mb-md">Picturebox【use_fileAPI】</div>
                        <Picturebox />
                    </q-card-section>
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
import Picturebox from '@/components/Picturebox.vue'
import MarqueeText from '@/components/MarqueeText.vue'
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
</style>
