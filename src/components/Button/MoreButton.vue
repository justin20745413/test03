<template>
    <div class="tw-flex tw-justify-center">
        <div class="slidingMoreContainer">
            <div :class="[directionClass]" class="operationButtonsContainer">
                <slot></slot>
            </div>

            <q-btn
                class="more-button tw-shadow-sm hover:tw-shadow-md"
                icon="more_horiz"
                outline
                round
            >
            </q-btn>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        num: number
        qtableProps?: any

        direction?: 'top' | 'bottom' | 'left' | 'right'
    }>(),
    {
        direction: 'left'
    }
)

const btnSize = '42px'

const opearationButtonsNumber = computed(() => props.num + 1)
const directionClass = computed((): string => {
    switch (props.direction) {
        case 'top':
            return 'slidingTop'
        case 'bottom':
            return 'slidingBottom'
        case 'left':
            return 'slidingLeft'
        case 'right':
            return 'slidingRight'
        default:
            return 'slidingLeft'
    }
})
</script>

<style lang="scss" scoped>
.slidingMoreContainer {
    position: relative;

    .operationButtonsContainer {
        position: absolute;
        border: 1px solid #e2e8f0;
        border-radius: calc(v-bind(btnSize) / 2);
        background-color: #fff;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        overflow: hidden;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10;

        &.slidingLeft {
            top: 0;
            right: 0;
            white-space: nowrap;
            width: v-bind(btnSize);
            height: v-bind(btnSize);
            padding-right: v-bind(btnSize);
            transform: translateX(10px);
        }

        &.slidingRight {
            top: 0;
            left: 0;
            white-space: nowrap;
            width: v-bind(btnSize);
            height: v-bind(btnSize);
            padding-left: v-bind(btnSize);
            transform: translateX(-10px);
        }

        &.slidingTop {
            bottom: 0;
            left: 0;
            width: v-bind(btnSize);
            height: v-bind(btnSize);
            padding-bottom: v-bind(btnSize);
            transform: translateY(10px);
        }

        &.slidingBottom {
            top: 0;
            left: 0;
            width: v-bind(btnSize);
            height: v-bind(btnSize);
            padding-top: v-bind(btnSize);
            transform: translateY(-10px);
        }
    }

    &:hover {
        .operationButtonsContainer {
            opacity: 1;
            transform: translateX(0) translateY(0);

            &.slidingLeft,
            &.slidingRight {
                width: calc(v-bind(btnSize) * v-bind(opearationButtonsNumber));
            }

            &.slidingTop,
            &.slidingBottom {
                height: calc(v-bind(btnSize) * v-bind(opearationButtonsNumber));
            }
        }
    }

    .more-button {
        transition: all 0.2s ease;
        background-color: white;
        border: 1px solid #e2e8f0;

        &:hover {
            background-color: #f8fafc;
            transform: scale(1.05);
        }
    }
}
</style>
