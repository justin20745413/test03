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
                    @failed="onUploadFailed"
                    @added="onFilesAdded"
                    style="max-width: 300px"
                    :max-files="10"
                    :max-file-size="10485760"
                    @rejected="onFilesRejected"
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
                :pagination.sync="pagination"
                @request="handlePaginationChange"
                :loading="loading"
                :filter="filter"
                flat
                class="my-table"
                binary-state-sort
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
                                props.row.status === '完成'
                                    ? 'positive'
                                    : props.row.status === '失敗'
                                      ? 'negative'
                                      : 'secondary'
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
                            {{ props.row.originalName.replace(/\.png$/i, '') }}
                        </div>
                    </q-td>
                </template>

                <template v-slot:bottom>
                    <div class="tw-flex tw-justify-between tw-items-center tw-w-full tw-px-4">
                        <div class="tw-flex tw-items-center tw-gap-4">
                            共
                            <span class="tw-font-bold" color="secondary">
                                {{ pagination.totalRows }}
                            </span>
                            個檔案
                        </div>
                        <div class="tw-flex tw-items-center tw-gap-4">
                            <q-pagination
                                v-model="pagination.page"
                                :max="pagination.totalPages"
                                :max-pages="6"
                                boundary-numbers
                                direction-links
                                boundary-links
                                color="primary"
                                size="sm"
                                class="tw-shadow-sm"
                                @update:model-value="
                                    (page) => handlePaginationChange({ ...pagination, page })
                                "
                            />
                            <q-select
                                v-model="pagination.rowsPerPage"
                                :options="[3, 5, 7]"
                                label="每頁顯示"
                                dense
                                outlined
                                options-dense
                                style="min-width: 100px"
                                @update:model-value="
                                    (val) =>
                                        handlePaginationChange({ ...pagination, rowsPerPage: val })
                                "
                            />
                        </div>
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
    totalRows: 0,
    sortBy: 'id',
    descending: true
})

// 上傳相關
const uploader = ref()

// 修改上傳配置
const uploadHeaders = computed(() => [{ name: 'Accept', value: 'application/json' }])

// 計算過濾後的行
const filteredRows = computed(() => {
    console.log('過濾前的原始數據:', rows.value)
    const searchTerm = filter.value.toLowerCase()
    const filtered = rows.value.filter((row) => {
        const name = row.name?.toLowerCase() || ''
        const type = row.type?.toLowerCase() || ''
        const uploader = row.uploader?.toLowerCase() || ''

        return (
            name.includes(searchTerm) || type.includes(searchTerm) || uploader.includes(searchTerm)
        )
    })
    console.log('過濾後的數據:', filtered)
    return filtered
})

// 添加上傳計數器
const uploadCounter = ref({
    total: 0,
    completed: 0,
    failed: 0
})

// 重置上傳計數器
const resetUploadCounter = () => {
    uploadCounter.value = {
        total: 0,
        completed: 0,
        failed: 0
    }
}

// 方法
const toggleUploader = () => {
    openUploader.value = !openUploader.value
}

// 修改處理分頁和排序變更的函數
const handlePaginationChange = async (newPagination: any) => {
    console.log('分頁或排序變更:', newPagination)
    // 清空已選擇的行
    selectedRows.value = []
    // 更新本地分頁狀態
    pagination.value = {
        ...pagination.value,
        ...newPagination
    }
    // 重新獲取數據
    await fetchFiles()
}

//  fetchFiles 函數
const fetchFiles = async () => {
    try {
        loading.value = true
        console.log('發送請求參數:', {
            page: pagination.value.page,
            rowsPerPage: pagination.value.rowsPerPage,
            sortBy: pagination.value.sortBy,
            sortOrder: pagination.value.descending ? 'desc' : 'asc'
        })

        const response = await fileApi.getFiles(
            pagination.value.page,
            pagination.value.rowsPerPage,
            {
                sortBy: pagination.value.sortBy || 'id',
                sortOrder: pagination.value.descending ? 'desc' : 'asc'
            }
        )

        console.log('服務器響應數據:', response)

        if (response && Array.isArray(response.files)) {
            // 在更新數據之前先打印
            console.log('原始文件數據:', response.files)

            rows.value = response.files.map((file) => ({
                id: file.id,
                name: file.fileName,
                originalName: file.originalName,
                type: file.fileType,
                size: formatFileSize(file.fileSize),
                uploader: file.uploaderName,
                status: file.status,
                uploadDate: file.uploadDate
            }))

            // 打印轉換後的數據
            console.log('轉換後的行數據:', rows.value)

            // 更新分頁信息
            pagination.value = {
                ...pagination.value,
                totalPages: response.totalPages,
                totalRows: response.total,
                page: response.page || pagination.value.page
            }

            console.log('更新後的分頁信息:', pagination.value)
        } else {
            console.error('無效的響應格式:', response)
            throw new Error('獲取檔案列表失敗')
        }
    } catch (error) {
        console.error('獲取檔案列表錯誤:', error)
        Notify.create({
            type: 'negative',
            message: '獲取檔案列表失敗',
            timeout: 5000
        })
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
                    originalName: file.originalName,
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

// 修改上傳完成處理
const onUploadComplete = async (info: any) => {
    console.log('上傳完成信息:', info)
    try {
        let response
        try {
            response = JSON.parse(info.xhr.response)
        } catch (e) {
            console.error('解析響應失敗:', e)
            uploadCounter.value.failed++
            throw new Error('服務器響應格式錯誤')
        }

        if (response.success) {
            uploadCounter.value.completed++
        } else {
            uploadCounter.value.failed++
            throw new Error(response.detail || '上傳失敗')
        }

        // 檢查是否所有文件都已處理完成
        if (
            uploadCounter.value.completed + uploadCounter.value.failed ===
            uploadCounter.value.total
        ) {
            if (uploadCounter.value.failed > 0) {
                Notify.create({
                    type: 'warning',
                    message: `上傳完成，但有 ${uploadCounter.value.failed} 個文件失敗`,
                    timeout: 5000
                })
            } else {
                Notify.create({
                    type: 'positive',
                    message: '所有檔案上傳成功'
                })
            }

            // 所有文件處理完成後才更新列表和關閉上傳器
            await fetchFiles()
            openUploader.value = false
            resetUploadCounter()
        }
    } catch (error) {
        console.error('上傳處理失敗:', error)
    }
}

// 修改上傳失敗處理
const onUploadFailed = (info: any) => {
    console.error('上傳失敗詳情:', info)
    uploadCounter.value.failed++

    try {
        if (info.xhr?.response) {
            const response = JSON.parse(info.xhr.response)
            Notify.create({
                type: 'negative',
                message: response.detail || response.error || '上傳失敗'
            })
            console.error('服務器錯誤詳情:', response)
        }
    } catch (error) {
        console.error('解析錯誤響應失敗:', error)
    }

    // 檢查是否所有文件都已處理完成
    if (uploadCounter.value.completed + uploadCounter.value.failed === uploadCounter.value.total) {
        Notify.create({
            type: 'warning',
            message: `上傳完成，但有 ${uploadCounter.value.failed} 個文件失敗`,
            timeout: 5000
        })
        fetchFiles()
        openUploader.value = false
        resetUploadCounter()
    }
}

// 修改文件添加處理
const onFilesAdded = (files: any) => {
    uploadCounter.value.total = files.length
    console.log('添加的文件數量:', files.length)
}

const onFilesRejected = (rejectedEntries: any) => {
    console.log('拒絕的文件:', rejectedEntries)
    rejectedEntries.forEach((entry: any) => {
        let message = ''
        if (entry.failedPropValidation === 'max-file-size') {
            message = `文件 ${entry.file.name} 超過大小限制 (10MB)`
        } else if (entry.failedPropValidation === 'max-files') {
            message = '超過最大文件數量限制 (10個)'
        } else {
            message = `文件 ${entry.file.name} 無法上傳`
        }
        Notify.create({
            type: 'negative',
            message: message
        })
    })
}

// 修改 columns 定義
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
        field: 'originalName',
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
        field: 'actions',
        sortable: false
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
}

:deep(.q-table thead th) {
    background-color: var(--q-background) !important;
}

:deep(.q-table tbody tr:hover) {
    background-color: #f1f5f9 !important;
}

:deep(.q-table tbody tr:hover) {
    background-color: rgba(69, 178, 192, 0.3) !important;
}
</style>
