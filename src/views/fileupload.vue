<template>
    <div class="layoutPageHeader">
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div class="tw-flex tw-items-center">
                <q-icon name="folder" class="tw-text-primary tw-text-3xl tw-mr-3" />
                <span class="tw-text-2xl tw-font-bold">檔案上傳區</span>
            </div>
            <div class="tw-flex tw-flex-col tw-items-end tw-gap-4">
                <q-btn color="primary" icon="upload" label="新增新檔案" @click="toggleUploader" />
                <q-uploader
                    v-if="openUploader"
                    ref="uploader"
                    :url="uploadUrl"
                    :headers="getHeaders"
                    field-name="files"
                    color="primary"
                    label="選擇檔案"
                    multiple
                    :max-files="5"
                    @added="onFilesAdded"
                    @uploaded="onFilesUploaded"
                    :auto-upload="false"
                    :with-credentials="false"
                    :form-fields="[
                        {
                            name: 'charset',
                            value: 'utf-8'
                        }
                    ]"
                />
            </div>
        </div>

        <q-card class="tw-shadow-lg tw-rounded-xl">
            <q-table
                :rows="filteredRows"
                :columns="columns"
                row-key="id"
                selection="multiple"
                v-model:selected="selectedRows"
                :rows-per-page="5"
                :pagination.sync="pagination"
                :loading="loading"
                :filter="filter"
                flat
                class="my-table"
            >
                <template v-slot:top>
                    <div class="tw-flex tw-items-center tw-w-full tw-gap-4">
                        <q-input
                            outlined
                            dense
                            debounce="300"
                            v-model="filter"
                            placeholder="搜尋檔案名稱、類型或上傳者..."
                            class="tw-flex-1"
                        >
                            <template v-slot:prepend>
                                <q-icon name="search" class="tw-text-gray-400" />
                            </template>
                        </q-input>
                        <q-btn
                            v-if="selectedRows.length > 0"
                            color="negative"
                            icon="delete"
                            label="刪除所選"
                            @click="deleteFiles(selectedRows)"
                        />
                    </div>
                </template>

                <template #body-cell-status="props">
                    <q-td :props="props">
                        <q-chip
                            :color="
                                props.row.status === 'success'
                                    ? 'positive'
                                    : props.row.status === 'error'
                                      ? 'negative'
                                      : 'grey'
                            "
                            text-color="white"
                            size="sm"
                            class="tw-min-w-[80px]"
                        >
                            {{ props.row.status }}
                        </q-chip>
                    </q-td>
                </template>

                <template #body-cell-actions="props">
                    <q-td :props="props">
                        <div class="tw-flex tw-gap-2">
                            <q-btn
                                flat
                                round
                                color="primary"
                                icon="download"
                                size="sm"
                                @click="downloadFile(props.row.name)"
                            />
                            <q-btn
                                flat
                                round
                                color="negative"
                                icon="delete"
                                size="sm"
                                @click="deleteFiles([props.row])"
                            />
                        </div>
                    </q-td>
                </template>

                <template v-slot:bottom>
                    <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-px-4">
                        <div class="tw-text-gray-600">共 {{ rows.length }} 個檔案</div>
                        <q-pagination
                            v-model="pagination.page"
                            :max="Math.ceil(rows.length / pagination.rowsPerPage)"
                            boundary-numbers
                            direction-links
                            boundary-links
                            color="primary"
                            size="sm"
                            class="tw-shadow-sm"
                        />
                    </div>
                </template>
            </q-table>
        </q-card>
    </div>

    <q-btn label="重置 ID 計數器" color="primary" @click="resetIdCounter" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify, QTableColumn } from 'quasar'
import { APIFileResponse, FileService, FileData } from '@/types/fileUpload'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
const uploadUrl = `${apiUrl}/upload`
const checkUrl = `${apiUrl}/upload/check`
const getHeaders = () => [
    { name: 'Authorization', value: `Bearer ${localStorage.getItem('token')}` }
]

const openUploader = ref(false)
const toggleUploader = () => {
    openUploader.value = !openUploader.value
}

const rows = ref<FileData[]>([])
const loading = ref(true)
const filter = ref('')
const rowsPerPage = ref(5)
const pagination = ref({ page: 1, rowsPerPage: rowsPerPage.value })
const selectedRows = ref<any[]>([])

const columns: QTableColumn[] = [
    {
        name: 'id',
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true,
        classes: 'tw-font-medium'
    },
    {
        name: 'name',
        label: '檔案名稱',
        align: 'left',
        field: 'name',
        sortable: true,
        classes: 'tw-font-medium'
    },
    { name: 'type', label: '類型', align: 'center', field: 'type', sortable: true },
    { name: 'date', label: '上傳日期', align: 'center', field: 'date', sortable: true },
    { name: 'size', label: '檔案大小', align: 'center', field: 'size', sortable: true },
    { name: 'uploader', label: '上傳者', align: 'center', field: 'uploader', sortable: true },
    { name: 'status', label: '狀態', align: 'center', field: 'status', sortable: true },
    {
        name: 'actions',
        label: '操作',
        align: 'center',
        field: 'actions',
        sortable: true
    }
]

const filteredRows = computed(() => {
    const sortedRows = [...rows.value].sort((a, b) => b.id - a.id)
    const filtered = sortedRows.filter((row) =>
        Object.values(row).join(' ').toLowerCase().includes(filter.value.toLowerCase())
    )
    const start = (pagination.value.page - 1) * pagination.value.rowsPerPage
    const end = start + pagination.value.rowsPerPage
    return filtered.slice(start, end)
})

const fetchFiles = async () => {
    loading.value = true
    rows.value = []
    try {
        const response = await axios.get(`${apiUrl}/files`)
        rows.value = response.data.map((file: APIFileResponse) => ({
            id: file.id,
            name: file.fileName,
            type: file.fileType,
            date: new Date(file.uploadDate).toLocaleDateString(),
            size: FileService.formatFileSize(file.fileSize),
            uploader: file.uploaderName,
            status: file.status
        }))
    } catch (error) {
        console.error('獲取檔案失敗:', error)
        Notify.create({
            type: 'negative',
            message: '獲取檔案失敗'
        })
    }
    loading.value = false
}

const uploader = ref()
const confirmDialog = ref(false)
const currentFile = ref(null)

const onFilesAdded = async (files: readonly any[]) => {
    try {
        for (const file of files) {
            try {
                await axios.post(checkUrl, null, {
                    params: { fileName: file.name }
                })
                // 如果檔案不存在，加入上傳隊列
                uploader.value.addFiles([file])
            } catch (error: any) {
                if (error.response?.status === 409) {
                    // 檔案已存在，顯示確認對話框
                    currentFile.value = file
                    confirmDialog.value = true
                    return // 停止處理其他檔案
                }
                throw error
            }
        }
    } catch (error) {
        console.error('檢查檔案失敗:', error)
        Notify.create({
            type: 'negative',
            message: '檢查檔案時發生錯誤'
        })
    }
}

const onFilesUploaded = async () => {
    await fetchFiles() // 重新獲取檔案列表
    Notify.create({
        type: 'positive',
        message: '檔案上傳成功！'
    })
    openUploader.value = false
}

const downloadFile = async (fileName: string) => {
    try {
        const blob = await FileService.downloadFile(fileName)
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: '檔案下載失敗'
        })
    }
}

const deleteFiles = async (filesToDelete = selectedRows.value) => {
    try {
        for (const row of filesToDelete) {
            await FileService.deleteFile(row.name)
        }
        await fetchFiles()
        selectedRows.value = []
        Notify.create({
            type: 'positive',
            message: '檔案刪除成功'
        })
    } catch (error) {
        console.error('刪除失敗:', error)
        Notify.create({
            type: 'negative',
            message: '檔案刪除失敗'
        })
    }
}

const resetIdCounter = async () => {
    try {
        const response = await axios.post(`${apiUrl}/reset-id`)
        if (response.data.success) {
            Notify.create({
                type: 'positive',
                message: 'ID 計數器已重置'
            })
            await fetchFiles() // 重置後重新獲取檔案列表
        }
    } catch (error) {
        console.error('重置 ID 計數器失敗:', error)
        Notify.create({
            type: 'negative',
            message: '重置 ID 計數器失敗'
        })
    }
}

onMounted(() => {
    fetchFiles()
})
</script>

<style lang="scss" scoped>
.layoutPageHeader {
    padding: 1.5rem;
    background-color: var(--q-bg-color);
}

.my-table {
    :deep(.q-table__card) {
        box-shadow: none;
    }

    :deep(.q-table thead tr) {
        background-color: #f8fafc;
    }

    :deep(.q-table tbody tr:hover) {
        background-color: #f1f5f9;
    }
}
</style>
