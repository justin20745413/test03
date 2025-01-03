<template>
    <div class="">
        <div class="q-mt-lg">
            <draggable v-model="products" :itemKey="'id'" class="product-grid" tag="div">
                <template #item="{ element }">
                    <div class="product-card list-group-item">
                        <img
                            :src="`https://picsum.photos/1000/500/?random=${element.image}`"
                            :alt="element.name"
                            class="product-image"
                        />
                        <h3 class="product-title">{{ element.name }}</h3>
                        <p class="product-price">{{ element.price }}</p>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores'
import { ref } from 'vue'
import draggable from 'vuedraggable'

const store = useMainStore()
const products = ref(store.products)
</script>

<style lang="scss" scoped>
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 16px;
}

.product-card {
    background: var(--q-warning);
    border-radius: 8px;
    padding: 16px;
    transition: transform 0.3s ease;
    cursor: move;

    &:hover {
        transform: translateY(-4px);
    }

    .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
    }
}

@media (max-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        padding: 12px;
    }

    .product-card {
        .product-image {
            height: 160px;
        }
    }
}

@media (max-width: 480px) {
    .product-grid {
        grid-template-columns: 1fr;
        gap: 12px;
        padding: 8px;
    }
}
</style>
