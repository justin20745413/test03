<template>
    <div class="form-toggle">
        <q-toggle
            v-model="localValue"
            :color="color"
            :disable="disable"
            class="tw-transition-all tw-duration-300"
        >
            <template #default>
                <span
                    :class="{ 'tw-text-primary': modelValue === trueValue }"
                    class="tw-ml-2 tw-text-sm tw-transition-colors tw-duration-300"
                >
                    {{ label }}
                </span>
            </template>
        </q-toggle>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
    modelValue: any
    label?: string
    trueValue?: any
    falseValue?: any
    color?: string
    disable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: '',
    trueValue: true,
    falseValue: false,
    color: 'primary',
    disable: false
})

const emit = defineEmits(['update:modelValue'])

const localValue = computed({
    get: () => props.modelValue === props.trueValue,
    set: (val: boolean) => {
        emit('update:modelValue', val ? props.trueValue : props.falseValue)
    }
})
</script>

<style lang="scss" scoped>
.form-toggle {
    .q-toggle {
        &__inner {
            &--truthy {
                color: var(--q-primary);
            }
        }
    }
}
</style>
