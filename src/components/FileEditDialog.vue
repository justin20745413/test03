<template>
    <q-dialog v-model="show" persistent>
        <q-card style="min-width: 350px">
            <q-card-section class="row items-center">
                <div class="text-h6">編輯檔案</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-form @submit="handleSubmit" class="tw-space-y-4">
                    <q-input
                        v-model="form.originalName"
                        label="檔案名稱"
                        :rules="[(val) => !!val || '請輸入檔案名稱']"
                        outlined
                        dense
                    />

                    <q-file
                        v-model="form.newFile"
                        label="更換檔案"
                        outlined
                        dense
                        :hint="`當前檔案: ${currentFile?.originalName || ''}`"
                    >
                        <template v-slot:prepend>
                            <q-icon name="attach_file" />
                        </template>
                    </q-file>

                    <q-select
                        v-model="form.status"
                        :options="statusOptions"
                        label="狀態"
                        outlined
                        dense
                        :rules="[(val) => !!val || '請選擇狀態']"
                    />

                    <q-input
                        v-model="form.uploadDate"
                        label="上傳日期"
                        outlined
                        dense
                        type="datetime-local"
                        :rules="[(val) => !!val || '請選擇日期']"
                    />

                    <div class="tw-flex tw-justify-end tw-gap-2">
                        <q-btn label="取消" color="grey" v-close-popup />
                        <q-btn label="確認" type="submit" color="primary" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { FileData } from '../types/fileUpload'

const props = defineProps<{
    modelValue: boolean
    currentFile: FileData | null
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const show = ref(props.modelValue)
const statusOptions = ['完成', '待審核', '隱藏']

const form = ref({
    originalName: '',
    newFile: null as File | null,
    status: '',
    uploadDate: ''
})

watch(
    () => props.modelValue,
    (val) => {
        show.value = val
    }
)

watch(
    () => show.value,
    (val) => {
        emit('update:modelValue', val)
    }
)

watch(
    () => props.currentFile,
    (file) => {
        if (file) {
            form.value = {
                originalName: file.originalName,
                newFile: null,
                status: file.status,
                uploadDate: new Date(file.uploadDate).toISOString().slice(0, 16)
            }
        }
    }
)

const handleSubmit = () => {
    emit('submit', {
        ...form.value,
        id: props.currentFile?.id
    })
}
</script>
