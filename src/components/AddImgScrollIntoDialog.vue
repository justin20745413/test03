<template>
    <q-dialog v-model="isShow" persistent>
        <q-card class="tw-w-[600px]">
            <q-card-section class="tw-flex tw-items-center">
                <div class="text-h6">{{ title }}</div>
                <q-space />
                <q-btn v-close-popup flat round icon="close" />
            </q-card-section>

            <q-card-section class="tw-space-y-4">
                <!-- ID顯示 -->
                <div class="tw-flex tw-items-center tw-gap-2">
                    <span class="tw-w-24 tw-text-gray-600">ID：</span>
                    <span class="tw-text-primary">{{ nextId }}</span>
                </div>

                <!-- 區塊類型選擇 -->
                <div class="tw-flex tw-items-center tw-gap-2">
                    <span class="tw-w-24 tw-text-gray-600">區塊類型：</span>
                    <q-select
                        v-model="formData.indexPartType"
                        :options="indexPartTypeOptions"
                        class="tw-flex-1"
                        dense
                        outlined
                        emit-value
                        map-options
                        option-label="label"
                        option-value="value"
                    />
                </div>

                <!-- 名稱輸入 -->
                <div class="tw-flex tw-items-center tw-gap-2">
                    <span class="tw-w-24 tw-text-gray-600">名稱：</span>
                    <q-input
                        v-model="formData.customName"
                        class="tw-flex-1"
                        dense
                        outlined
                        placeholder="請輸入名稱"
                    />
                </div>

                <!-- 樣式設定 -->
                <div class="tw-flex tw-items-start tw-gap-2">
                    <span class="tw-w-24 tw-text-gray-600 tw-pt-2">樣式設定：</span>
                    <div class="tw-flex-1 tw-space-y-4">
                        <!-- 樣式A -->
                        <div class="tw-space-y-2">
                            <div class="tw-flex tw-items-center tw-gap-2">
                                <q-badge color="primary">樣式 A</q-badge>
                                <q-file
                                    v-model="formData.styleAImage"
                                    accept="image/*"
                                    class="tw-flex-1"
                                    dense
                                    outlined
                                    :label="formData.styleAImage?.name || '請選擇圖片'"
                                >
                                    <template #prepend>
                                        <q-icon name="attach_file" />
                                    </template>
                                </q-file>
                            </div>
                            <q-img
                                v-if="formData.styleAImage"
                                :src="previewStyleA"
                                class="tw-w-full tw-h-40 tw-object-cover tw-rounded"
                            />
                        </div>

                        <!-- 樣式B -->
                        <div class="tw-space-y-2">
                            <div class="tw-flex tw-items-center tw-gap-2">
                                <q-badge color="secondary">樣式 B</q-badge>
                                <q-file
                                    v-model="formData.styleBImage"
                                    accept="image/*"
                                    class="tw-flex-1"
                                    dense
                                    outlined
                                    :label="formData.styleBImage?.name || '請選擇圖片'"
                                >
                                    <template #prepend>
                                        <q-icon name="attach_file" />
                                    </template>
                                </q-file>
                            </div>
                            <q-img
                                v-if="formData.styleBImage"
                                :src="previewStyleB"
                                class="tw-w-full tw-h-40 tw-object-cover tw-rounded"
                            />
                        </div>
                    </div>
                </div>

                <!-- 顯示狀態 -->
                <div class="tw-flex tw-items-center tw-gap-2">
                    <span class="tw-w-24 tw-text-gray-600">顯示狀態：</span>
                    <q-toggle
                        v-model="formData.status"
                        :false-value="IndexPartStatusEnum.DISABLE"
                        :true-value="IndexPartStatusEnum.ENABLE"
                        color="primary"
                        :label="formData.status === IndexPartStatusEnum.ENABLE ? '顯示' : '隱藏'"
                    />
                </div>
            </q-card-section>

            <q-card-actions align="right" class="tw-p-4">
                <q-btn v-close-popup flat label="取消" />
                <q-btn :loading="isSubmitting" color="primary" label="確認" @click="onSubmit" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { IndexPartStatusEnum, IndexPartTypeEnum } from '@/enum/StatusEnum'

const props = defineProps<{
    modelValue: boolean
    title?: string
    nextId: number
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: any): void
}>()

const isShow = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const isSubmitting = ref(false)

// 添加區塊類型選項
const indexPartTypeOptions = [
    { label: '輪播圖', value: IndexPartTypeEnum.CAROUSEL },
    { label: '圖片卡', value: IndexPartTypeEnum.IMAGE_CARD },
    { label: '行事曆', value: IndexPartTypeEnum.CALENDAR },
    { label: '公告訊息', value: IndexPartTypeEnum.BULLETIN },
    { label: '宣傳服務', value: IndexPartTypeEnum.POLICY }
]

const formData = ref({
    indexPartId: props.nextId,
    customName: '',
    styleAImage: null as File | null,
    styleBImage: null as File | null,
    status: IndexPartStatusEnum.ENABLE,
    indexPartType: IndexPartTypeEnum.IMAGE_CARD
})

// 圖片預覽
const previewStyleA = computed(() => {
    return formData.value.styleAImage ? URL.createObjectURL(formData.value.styleAImage) : ''
})

const previewStyleB = computed(() => {
    return formData.value.styleBImage ? URL.createObjectURL(formData.value.styleBImage) : ''
})

const onSubmit = async () => {
    try {
        isSubmitting.value = true
        await emit('submit', { ...formData.value })
        isShow.value = false
    } finally {
        isSubmitting.value = false
    }
}
</script>
