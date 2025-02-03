<template>
    <div class="layoutPageHeader">
        <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
            <div class="tw-flex tw-items-center">
                <q-icon name="folder" class="tw-text-primary tw-text-3xl tw-mr-3" size="md" />
                <span class="tw-text-2xl tw-font-bold">檔案上傳區</span>
            </div>
            <div class="tw-flex tw-flex-col tw-items-end tw-gap-3">
                <q-btn
                    :color="openUploader ? 'negative' : 'primary'"
                    :icon="openUploader ? 'close' : 'upload'"
                    :label="openUploader ? '關閉上傳' : '新增檔案'"
                    @click="toggleUploader"
                />
                <div v-if="openUploader" class="tw-w-full tw-max-w-[300px] tw-mr-5">
                    <q-uploader
                        ref="uploader"
                        :url="`${API_BASE_URL}/api/upload`"
                        field-name="files"
                        color="primary"
                        label="選擇檔案"
                        multiple
                        :headers="uploadHeaders"
                        :auto-upload="false"
                        @uploaded="onUploadComplete"
                        @failed="onUploadFailed"
                        @added="onFilesAdded"
                        :max-files="10"
                        :max-file-size="10485760"
                        @rejected="onFilesRejected"
                    >
                        <template v-slot:list="scope">
                            <draggable
                                :list="[...scope.files]"
                                item-key="name"
                                handle=".drag-handle"
                                @start="drag = true"
                                @end="drag = false"
                                @change="handleFilesReorder"
                                class="q-uploader__list"
                            >
                                <template #item="{ element: file }">
                                    <div class="q-uploader__file relative-position">
                                        <div
                                            class="drag-handle tw-cursor-move tw-absolute tw-left-2 tw-top-1/2 tw-transform -tw-translate-y-1/2"
                                        >
                                            <q-icon
                                                name="drag_indicator"
                                                size="sm"
                                                class="tw-text-gray-400"
                                            />
                                        </div>
                                        <div class="tw-pl-8">
                                            <div class="q-uploader__file-header">
                                                <div class="q-uploader__file-name">
                                                    {{ file.name }}
                                                </div>
                                                <div class="q-uploader__file-size">
                                                    {{ formatFileSize(file.size) }}
                                                </div>
                                            </div>
                                            <q-linear-progress
                                                v-if="file.__progress"
                                                :value="file.__progress"
                                                class="q-mt-xs"
                                            />
                                        </div>
                                    </div>
                                </template>
                            </draggable>
                            <div
                                v-if="scope.files.length > 0"
                                class="tw-flex tw-justify-center items-center tw-py-1 tw-bg-gray-500 tw-rounded-lg"
                            >
                                <q-icon name="bolt" color="white" />
                                <span class="tw-text-white">到底拉 Orz...</span>
                            </div>
                        </template>
                    </q-uploader>
                    <div v-if="openUploader" class="tw-flex tw-items-center tw-justify-end tw-mt-2">
                        <q-icon name="info" color="primary" />
                        <span class="tw-text-gray-400 tw-text-xs">
                            最多上傳10個檔案，單個檔案最大10MB ~
                        </span>
                    </div>
                </div>
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
                    <div class="tw-flex tw-w-full tw-gap-4">
                        <q-input
                            outlined
                            dense
                            debounce="300"
                            v-model="filter"
                            placeholder="(quasar的q-input) 搜尋檔案名稱、類型或上傳者..."
                            class="tw-flex-1"
                        >
                            <template v-slot:prepend>
                                <q-icon name="search" class="tw-text-gray-400" />
                            </template>
                        </q-input>
                        <div class="tw-relative tw-flex-1">
                            <input
                                type="text"
                                v-model="filter"
                                placeholder="(原生input) 搜尋檔案名稱、類型或上傳者..."
                                style="background-color: var(--q-dark) var(--ptext-dark)"
                                class="tw-w-full tw-px-10 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-outline-none focus:tw-border-primary focus:tw-ring-1 focus:tw-ring-primary"
                            />
                            <q-icon
                                name="search"
                                class="tw-absolute tw-left-3 tw-top-1/2 tw-transform -tw-translate-y-16 tw-text-gray-400"
                                size="sm"
                            />
                        </div>
                        <q-btn
                            v-if="selectedRows.length > 0"
                            color="negative"
                            icon="delete"
                            label="刪除所選"
                            @click="deleteFiles(selectedRows)"
                            class="tw-max-h-[40px]"
                        />
                    </div>
                </template>

                <template #body-cell-status="props">
                    <q-td :props="props">
                        <q-chip
                            :color="
                                props.row.status === '完成'
                                    ? 'positive'
                                    : props.row.status === '隱藏'
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
                                icon="edit"
                                size="sm"
                                @click="editFile(props.row)"
                            />
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

                <template #body-cell-img="props">
                    <q-td :props="props">
                        <div class="tw-flex tw-justify-center tw-items-center">
                            <img
                                :src="getFileUrl(props.row.name)"
                                class="tw-w-10 tw-h-10"
                                alt="檔案圖片"
                            />
                        </div>
                    </q-td>
                </template>

                <template #body-cell-uploadDate="props">
                    <q-td :props="props">
                        {{ new Date(props.row.uploadDate).toLocaleString() }}
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

    <FileEditDialog
        v-model="editDialog"
        :current-file="currentEditFile"
        @submit="handleEditSubmit"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Notify } from 'quasar'
import type { FileData, APIFileResponse } from '../types/fileUpload'
import { fileApi } from '../services/fileApi'
import { API_BASE_URL } from '../services/fileApi'
import type { ITableColumn } from '../types/completeTable'
import { watch } from 'vue'
import { formatFileSize } from '@/utils/fileSize'
import draggable from 'vuedraggable'
import FileEditDialog from '../components/FileEditDialog.vue'

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
const debouncedFilter = ref(filter.value)
let debounceTimeout: NodeJS.Timeout | null = null

// 使用 debounce 函數延遲更新過濾值
const updateDebouncedFilter = () => {
    // 清除之前的 timeout
    if (debounceTimeout) {
        clearTimeout(debounceTimeout)
    }

    // 設置新的 timeout
    debounceTimeout = setTimeout(() => {
        debouncedFilter.value = filter.value
    }, 300)
}

// 監聽 filter 變化
watch(filter, () => {
    updateDebouncedFilter()
})

// 添加中英文搜尋功能
const filteredRows = computed(() => {
    const searchTerm = debouncedFilter.value.toLowerCase()
    const filtered = rows.value.filter((row) => {
        const name = (row.originalName || '').toString().toLowerCase()
        const type = (row.type || '').toString().toLowerCase()
        const uploader = (row.uploader || '').toString().toLowerCase()

        const isChinese = /[\u4e00-\u9fa5]/.test(searchTerm)
        // 如果是中文,直接比對原始值
        if (isChinese) {
            return (
                (row.originalName || '').includes(debouncedFilter.value) ||
                (row.type || '').includes(debouncedFilter.value) ||
                (row.uploader || '').includes(debouncedFilter.value)
            )
        }

        // 如果是英文,比對轉小寫後的值
        return (
            name.includes(searchTerm) || type.includes(searchTerm) || uploader.includes(searchTerm)
        )
    })
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

        const response = await fileApi.getFiles(
            pagination.value.page,
            pagination.value.rowsPerPage,
            {
                sortBy: pagination.value.sortBy || 'id',
                sortOrder: pagination.value.descending ? 'desc' : 'asc'
            }
        )

        if (response && Array.isArray(response.files)) {
            // 在更新數據之前先打印
            console.log('原始文件數據:', response.files)

            rows.value = response.files.map((file: APIFileResponse) => ({
                id: file.id,
                name: file.fileName,
                originalName: file.originalName,
                type: file.fileType,
                size: formatFileSize(file.fileSize),
                uploader: file.uploaderName,
                status: file.status,
                uploadDate: file.uploadDate
            }))

            // 更新分頁信息
            pagination.value = {
                ...pagination.value,
                totalPages: response.totalPages,
                totalRows: response.total,
                page: response.page || pagination.value.page
            }
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

const downloadFile = (fileName: string) => {
    window.open(fileApi.downloadFile(fileName), '_self')
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
                    size: formatFileSize(file.fileSize),
                    uploader: file.uploaderName,
                    status: file.status,
                    uploadDate: file.uploadDate
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
            console.log('原始響應:', info.xhr.response)
            response = JSON.parse(info.xhr.response)
            console.log('解析後的響應:', response)
        } catch (e) {
            console.error('解析響應失敗:', e)
            uploadCounter.value.failed++
            throw new Error('服務器響應格式錯誤')
        }

        if (response && response.success && response.files) {
            uploadCounter.value.completed++
            console.log('文件上傳成功:', response.files)
        } else {
            uploadCounter.value.failed++
            throw new Error(response.detail || '上傳失敗')
        }

        // 檢查是否所有文件都已處理完成
        if (
            uploadCounter.value.completed + uploadCounter.value.failed ===
            uploadCounter.value.total
        ) {
            if (uploadCounter.value.completed > 0) {
                Notify.create({
                    type: 'positive',
                    message:
                        uploadCounter.value.failed > 0
                            ? `上傳完成：${uploadCounter.value.completed} 個成功，${uploadCounter.value.failed} 個失敗`
                            : '所有檔案上傳成功',
                    timeout: 5000
                })
            }

            // 更新列表並重置
            await fetchFiles()
            openUploader.value = false
            resetUploadCounter()
        }
    } catch (error) {
        console.error('上傳處理失敗:', error)
        Notify.create({
            type: 'negative',
            message: (error as Error).message || '上傳處理失敗',
            timeout: 5000
        })
    }
}

// 修改上傳失敗處理
const onUploadFailed = (info: any) => {
    console.error('上傳失敗詳情:', info)
    uploadCounter.value.failed++
    try {
        let errorMessage = '上傳失敗'

        // 檢查是否有響應內容
        if (info.xhr?.response) {
            console.log('伺服器返回的響應:', info.xhr.response)
            try {
                const response = JSON.parse(info.xhr.response)
                errorMessage = response.detail || response.error || '上傳失敗'
            } catch (e) {
                console.error('解析響應失敗:', e)
                errorMessage = '服務器響應格式錯誤'
            }
        } else if (info.xhr?.status) {
            // 處理 HTTP 狀態碼
            errorMessage = `上傳失敗 (HTTP ${info.xhr.status})`
        }

        // 顯示錯誤通知
        Notify.create({
            type: 'negative',
            message: errorMessage,
            timeout: 5000
        })
    } catch (error) {
        console.error('處理上傳失敗時出錯:', error)
        Notify.create({
            type: 'negative',
            message: '處理上傳失敗時出錯',
            timeout: 5000
        })
    }

    // 檢查是否所有文件都已處理完成
    if (uploadCounter.value.completed + uploadCounter.value.failed === uploadCounter.value.total) {
        // 添加延遲以確保狀態更新
        setTimeout(async () => {
            await fetchFiles()
            Notify.create({
                type: 'warning',
                message: `上傳完成，但有 ${uploadCounter.value.failed} 個文件失敗`,
                timeout: 5000
            })
            openUploader.value = false
            resetUploadCounter()
        }, 500)
    }
}

// 獲取檔案URL
const getFileUrl = (fileName: string) => {
    const url = `${API_BASE_URL}/api/uploads/${fileName}`
    return url
}

// 修改文件添加處理
const onFilesAdded = (files: any) => {
    console.log('添加的文件:', files)
    uploadCounter.value.total = files.length

    // 確保文件對象包含所有必要屬性
    files.forEach((file: any) => {
        if (!file.__key) {
            file.__key = Date.now() + Math.random().toString(36).substring(2)
        }
    })
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
        align: 'center',
        field: 'id',
        sortable: true
    },
    {
        name: 'img',
        required: true,
        label: '圖片',
        align: 'center',
        field: 'img',
        style: 'max-width: 50px'
    },
    {
        name: 'name',
        required: true,
        label: '檔案名稱',
        align: 'left',
        field: 'originalName',
        sortable: true,
        style: 'max-width: 250px;min-width: 250px'
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
        name: 'uploadDate',
        required: true,
        label: '上傳時間',
        align: 'left',
        field: 'uploadDate',
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

// 添加拖拽状态
const drag = ref(false)

// 編輯相關狀態
const editDialog = ref(false)
const currentEditFile = ref<FileData | null>(null)

// 編輯檔案方法
const editFile = (file: FileData) => {
    currentEditFile.value = file
    editDialog.value = true
}

// 修改處理編輯提交的方法
const handleEditSubmit = async (formData: any) => {
    try {
        if (!currentEditFile.value) return

        const form = new FormData()
        form.append('originalName', formData.originalName)
        form.append('uploadDate', new Date(formData.uploadDate).toISOString())
        form.append('status', formData.status)

        if (formData.newFile) {
            form.append('file', formData.newFile)
        }

        const response = await fileApi.updateFile(currentEditFile.value.id, form)

        if (response.success) {
            Notify.create({
                type: 'positive',
                message: '檔案更新成功'
            })
            editDialog.value = false
            await fetchFiles()
        }
    } catch (error) {
        console.error('更新檔案失敗:', error)
        Notify.create({
            type: 'negative',
            message: '更新檔案失敗'
        })
    }
}

// 初始化
onMounted(() => {
    fetchFiles()
})

const handleFilesReorder = (evt: any) => {
    const uploaderInstance = uploader.value

    if (!uploaderInstance) {
        console.error('找不到上傳器實例')
        return
    }

    // 獲取當前的文件隊列
    const files = uploaderInstance.files

    // 根據拖拽結果重新排序文件隊列
    if (evt.moved) {
        const { newIndex, oldIndex } = evt.moved
        const fileArray = [...files]
        const [movedItem] = fileArray.splice(oldIndex, 1)
        fileArray.splice(newIndex, 0, movedItem)

        // 保存文件的原始屬性
        const filesWithProps = fileArray.map((file) => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            __key: file.__key,
            __meta: file.__meta
        }))

        // 清空當前隊列
        uploaderInstance.reset()

        // 批量添加文件
        const newFiles = filesWithProps.map(({ file, ...props }) => {
            const newFile = new File([file], file.name, {
                type: file.type,
                lastModified: file.lastModified
            })

            Object.assign(newFile, {
                __key: props.__key,
                __meta: props.__meta
            })

            return newFile
        })

        uploaderInstance.addFiles(newFiles)

        setTimeout(() => {
            Notify.create({
                type: 'positive',
                message: '文件順序已更新',
                timeout: 2000
            })
        }, 100)
    }
}
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

.drag-handle {
    cursor: move;
    &:hover {
        opacity: 0.7;
    }
}

:deep(.q-uploader__file) {
    padding-left: 2rem;
}

.sortable-drag {
    opacity: 0.5;
    background: var(--q-primary) !important;
}

.sortable-ghost {
    opacity: 0.5;
    background: var(--q-primary) !important;
}
</style>
