<template>
    <q-drawer v-model="leftDrawerOpen as boolean" bordered :width="250" :breakpoint="400">
        <div class="fixed-navigation">
            <q-item-label header>Navigation</q-item-label>
        </div>
        <div class="scrollable-content">
            <q-list padding>
                <q-item clickable v-ripple to="/" exact>
                    <q-item-section avatar>
                        <q-icon name="home" />
                    </q-item-section>
                    <q-item-section>Home</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/products">
                    <q-item-section avatar>
                        <q-icon name="shopping_cart" />
                    </q-item-section>
                    <q-item-section>Products</q-item-section>
                </q-item>

                <q-separator class="q-my-md" />

                <q-item-label header>Tools</q-item-label>

                <q-item clickable v-ripple to="/fileupload">
                    <q-item-section avatar>
                        <q-icon name="drag_indicator" />
                    </q-item-section>
                    <q-item-section>檔案上傳區</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/Spline">
                    <q-item-section avatar>
                        <q-icon name="crop" />
                    </q-item-section>
                    <q-item-section>Spline</q-item-section>
                </q-item>

                <q-item clickable v-ripple to="/practice">
                    <q-item-section avatar>
                        <q-icon name="school" />
                    </q-item-section>
                    <q-item-section>練習區</q-item-section>
                </q-item>
            </q-list>
        </div>
    </q-drawer>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const leftDrawerOpen = inject('leftDrawerOpen')
</script>

<style lang="scss">
.q-drawer {
    display: flex;
    flex-direction: column;
    background-color: var(--q-background);

    .fixed-navigation {
        flex-shrink: 0;
        background-color: var(--q-background);
        z-index: 1;
    }

    .scrollable-content {
        overflow-y: scroll;
        flex-grow: 1;
        overscroll-behavior: contain;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
            min-height: 40px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    }
}
</style>
