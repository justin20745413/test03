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
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}
.list-group-item {
    padding: 1rem;
    margin: 0.5rem 0;
    background: var(--q-warning);
    border-radius: 4px;
    cursor: move;
}
.product-title,
.product-price {
    color: var(--q-ptext);
}
</style>
