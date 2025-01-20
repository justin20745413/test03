<template>
    <div class="layoutPageHeader">
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div class="tw-flex tw-items-center">
                <q-icon name="folder" class="tw-text-primary tw-text-3xl tw-mr-3" />
                <span class="tw-text-2xl tw-font-bold">檔案上傳區</span>
            </div>
            <div class="tw-flex tw-flex-col tw-items-end tw-gap-3">
                <q-btn color="primary" icon="upload" label="新增新檔案" @click="toggleUploader" />
                <q-uploader
                    v-if="openUploader"
                    ref="uploader"
                    :url="`${API_BASE_URL}/upload`"
                    field-name="files"
                    color="primary"
                    label="選擇檔案"
                    multiple
                    :headers="uploadHeaders"
                    :auto-upload="false"
                    @uploaded="onUploadComplete"
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
                :rows-per-page="pagination.rowsPerPage"
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
                                      : 'primary'
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
                        <div class="tw-flex tw-justify-center tw-gap-2">
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

                <template #body-cell-name="props">
                    <q-td :props="props">
                        <div class="tw-line-clamp-2 tw-break-words tw-whitespace-normal">
                            {{ props.row.name }}
                        </div>
                    </q-td>
                </template>

                <template v-slot:bottom>
                    <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-px-4">
                        <div class="tw-text-gray-600">共 {{ pagination.totalRows }} 個檔案</div>
                        <q-pagination
                            v-model="pagination.page"
                            :max="pagination.totalPages"
                            boundary-numbers
                            direction-links
                            boundary-links
                            color="primary"
                            size="sm"
                            class="tw-shadow-sm"
                            @update:model-value="fetchFiles"
                        />
                    </div>
                </template>
            </q-table>
        </q-card>
    </div>

    <div class="tw-flex tw-justify-end tw-mt-4 tw-mr-6">
        <q-btn label="重置 ID 計數器" color="primary" @click="resetIdCounter" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import type { FileData, APIFileResponse } from '../types/fileUpload'
import { fileApi } from '../services/fileApi'
import { API_BASE_URL } from '../services/fileApi'
import type { ITableColumn } from '../types/completeTable'

// 狀態變數
const openUploader = ref(false)
const loading = ref(false)
const rows = ref<FileData[]>([])
const filter = ref('')
const selectedRows = ref<FileData[]>([])

const pagination = ref({
    page: 1,
    rowsPerPage: 7,
    totalPages: 0,
    totalRows: 0
})

// 上傳相關
const uploader = ref()

// 上傳相關配置
const uploadHeaders = [
    {
        name: 'Accept',
        value: 'application/json'
    }
]

// 計算過濾後的行
const filteredRows = computed(() => {
    const searchTerm = filter.value.toLowerCase()
    return rows.value.filter((row) => {
        const name = row.name?.toLowerCase() || ''
        const type = row.type?.toLowerCase() || ''
        const uploader = row.uploader?.toLowerCase() || ''

        return (
            name.includes(searchTerm) || type.includes(searchTerm) || uploader.includes(searchTerm)
        )
    })
})

// 方法
const toggleUploader = () => {
    openUploader.value = !openUploader.value
}

const fetchFiles = async () => {
    try {
        loading.value = true
        const response = await fileApi.getFiles(
            pagination.value.page,
            pagination.value.rowsPerPage,
            {
                sortBy: 'id',
                sortOrder: 'desc'
            }
        )

        if (pagination.value.page > response.totalPages && response.totalPages > 0) {
            pagination.value.page = response.totalPages
            await fetchFiles()
            return
        }

        rows.value = response.files.map((file: APIFileResponse) => ({
            id: file.id,
            name: file.fileName,
            type: file.fileType,
            date: file.uploadDate,
            size: formatFileSize(file.fileSize),
            uploader: file.uploaderName,
            status: file.status
        }))

        pagination.value.totalRows = response.total
        pagination.value.totalPages = response.totalPages
    } catch (error) {
        console.error('獲取檔案列表失敗:', error)
    } finally {
        loading.value = false
    }
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const downloadFile = (fileName: string) => {
    window.open(fileApi.downloadFile(fileName), '_blank')
}

const deleteFiles = async (files: FileData[]) => {
    try {
        if (!confirm(`確定要刪除 ${files.length} 個檔案嗎？`)) {
            return
        }

        // 清除已選擇的檔案
        selectedRows.value = []

        for (const file of files) {
            const response = await fileApi.deleteFile(
                file.id,
                pagination.value.page,
                pagination.value.rowsPerPage
            )

            if (response && response.success) {
                // 更新分頁資訊
                pagination.value.page = response.data.page
                pagination.value.totalPages = response.data.totalPages
                pagination.value.totalRows = response.data.total

                // 更新檔案列表
                rows.value = response.data.files.map((file: APIFileResponse) => ({
                    id: file.id,
                    name: file.fileName,
                    type: file.fileType,
                    date: file.uploadDate,
                    size: formatFileSize(file.fileSize),
                    uploader: file.uploaderName,
                    status: file.status
                }))
            }
        }

        Notify.create({
            type: 'positive',
            message: '檔案刪除成功'
        })
    } catch (error: any) {
        console.error('刪除檔案失敗:', error)
        Notify.create({
            type: 'negative',
            message: `刪除檔案失敗: ${error.message || '未知錯誤'}`
        })
    }
}

const resetIdCounter = async () => {
    try {
        await fileApi.resetIdCounter()
        await fetchFiles()
        Notify.create({
            type: 'positive',
            message: '重置成功'
        })
    } catch (error) {
        console.error('重置 ID 失敗:', error)
        Notify.create({
            type: 'negative',
            message: '重置失敗'
        })
    }
}

const onUploadComplete = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    await fetchFiles()
    openUploader.value = false
    Notify.create({
        type: 'positive',
        message: '檔案上傳成功'
    })
}

// 添加 columns 定義
const columns: ITableColumn[] = [
    {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true
    },
    {
        name: 'name',
        required: true,
        label: '檔案名稱',
        align: 'left',
        field: 'name',
        sortable: true,
        style: 'max-width: 250px'
    },
    {
        name: 'type',
        required: true,
        label: '檔案類型',
        align: 'left',
        field: 'type',
        sortable: true
    },
    {
        name: 'size',
        required: true,
        label: '檔案大小',
        align: 'left',
        field: 'size',
        sortable: true
    },
    {
        name: 'uploader',
        required: true,
        label: '上傳者',
        align: 'left',
        field: 'uploader',
        sortable: true
    },
    {
        name: 'status',
        required: true,
        label: '狀態',
        align: 'left',
        field: 'status',
        sortable: true
    },
    {
        name: 'actions',
        required: true,
        label: '操作',
        align: 'center',
        field: 'actions'
    }
]

// 初始化
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
:deep(.q-table thead th) {
    background-color: var(--q-background) !important;
}
</style>
