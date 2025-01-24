<template>
    <q-dialog v-model="show" persistent class="file-upload-dialog">
        <q-card class="dialog-card">
            <q-card-section class="header">
                <div class="text-h6 text-primary">編輯檔案</div>
                <q-btn
                    icon="close"
                    flat
                    round
                    dense
                    color="negative"
                    v-close-popup
                    class="close-btn"
                />
            </q-card-section>

            <q-separator />

            <q-card-section>
                <q-form @submit="handleSubmit" class="upload-form">
                    <section class="file-details">
                        <div class="section-title">檔案資訊</div>

                        <q-input
                            v-model="form.originalName"
                            label="檔案名稱"
                            :rules="[(val) => !!val || '請輸入檔案名稱']"
                            outlined
                            dense
                            color="primary"
                        >
                            <template v-slot:prepend>
                                <q-icon name="description" color="grey-6" />
                            </template>
                        </q-input>

                        <q-file
                            v-model="form.newFile"
                            label="更換檔案 (選填)"
                            outlined
                            dense
                            color="primary"
                            clearable
                        >
                            <template v-slot:prepend>
                                <q-icon name="attach_file" color="grey-6" />
                            </template>
                        </q-file>
                        <div class="tw-flex tw-items-center">
                            <span class="tw-mr-2">目前檔案:</span>
                            <div>
                                <q-chip
                                    v-if="currentFile"
                                    dense
                                    outline
                                    color="primary"
                                    class="tw-line-clamp-1"
                                >
                                    <span>
                                        {{
                                            currentFile.originalName.length > 57
                                                ? currentFile.originalName.substring(0, 57) + '...'
                                                : currentFile.originalName
                                        }}</span
                                    >
                                </q-chip>
                            </div>
                        </div>
                    </section>

                    <q-separator spaced />

                    <!-- Status Section -->
                    <section class="status-details">
                        <div class="section-title">狀態與日期</div>

                        <q-select
                            v-model="form.status"
                            :options="statusOptions"
                            label="狀態"
                            outlined
                            dense
                            color="primary"
                            :rules="[(val) => !!val || '請選擇狀態']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="category" color="grey-6" />
                            </template>
                        </q-select>

                        <q-input
                            v-model="form.uploadDate"
                            label="上傳日期"
                            outlined
                            dense
                            type="datetime-local"
                            color="primary"
                            :rules="[(val) => !!val || '請選擇日期']"
                        >
                            <template v-slot:prepend>
                                <q-icon name="event" color="grey-6" />
                            </template>
                        </q-input>
                    </section>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <q-btn label="取消" color="grey" v-close-popup class="cancel-btn" />
                        <q-btn label="確認" type="submit" color="primary" class="submit-btn" />
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

<style scoped>
.file-upload-dialog .dialog-card {
    min-width: 500px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
}

.close-btn {
    transition: background-color 0.3s;
}

.close-btn:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.upload-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.section-title {
    color: var(--q-primary);
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.file-details,
.status-details {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 16px;
}

.submit-btn {
    min-width: 100px;
}

.cancel-btn {
    min-width: 100px;
}
</style>
