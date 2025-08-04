<template>
    <q-page padding>
        <q-card class="tw-p-4 tw-relative tw-backdrop-blur-sm tw-bg-white/90 tw-shadow-xl">
            <!-- 編輯模式提示條 -->
            <div
                v-if="isEdit"
                class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-bg-gradient-to-r tw-from-primary/100 tw-py-3 tw-px-4 tw-text-center tw-text-white tw-font-medium tw-backdrop-blur-sm"
            >
                <q-icon name="edit" class="tw-mr-2 tw-animate-pulse" />
                <span>編輯模式</span>
            </div>
            <div
                v-if="!isEdit"
                class="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-bg-gradient-to-r tw-from-gray-500 tw-py-3 tw-px-4 tw-text-center tw-text-white tw-font-medium tw-backdrop-blur-sm"
            >
                <q-icon name="edit" class="tw-mr-2 tw-animate-pulse" />
                <span>自定義設定</span>
            </div>

            <div v-if="indexPartInfo" class="tw-flex tw-flex-nowrap tw-gap-6 tw-mt-12">
                <!-- 左側預覽列表 -->
                <ul
                    class="tw-list-none tw-space-y-7 tw-border tw-rounded-xl tw-p-4 tw-m-0 tw-flex-1 tw-max-w-[458px] tw-h-[calc(100vh-180px)] tw-overflow-y-auto tw-sticky tw-top-10 tw-transition-all tw-duration-300 hover:tw-shadow-2xl"
                    :class="{
                        ' tw-shadow-lg tw-bg-gradient-to-b tw-from-white tw-to-gray-50': isEdit
                    }"
                >
                    <!-- 預覽項目 -->
                    <template
                        v-for="indexPartItem in displayIndexPartList"
                        :key="indexPartItem.indexPartId"
                    >
                        <li
                            v-if="indexPartItem.status === IndexPartStatusEnum.ENABLE"
                            class="tw-transform tw-transition-all tw-duration-300 hover:tw-scale-[1.02]"
                        >
                            <div
                                :ref="(e: any) => setIndexPartRefs(e, indexPartItem.indexPartId)"
                                class="tw-relative tw-group"
                            >
                                <img
                                    :class="{
                                        'tw-transition-all tw-duration-300': true,
                                        'tw-blur-[5px] tw-brightness-95':
                                            Object.values(isHoverMap).some((value) => value) &&
                                            !isHoverMap[indexPartItem.indexPartId]
                                    }"
                                    :src="
                                        getBlockImage(
                                            indexPartItem.indexPartId,
                                            indexPartItem.indexPartStyle
                                        )
                                    "
                                    class="tw-w-full tw-rounded-xl tw-max-h-[70vh] tw-shadow-md tw-transition-transform tw-duration-300 tw-relative"
                                    @error="
                                        handleImageError(
                                            $event,
                                            indexPartItem.indexPartId,
                                            indexPartItem.indexPartStyle
                                        )
                                    "
                                />
                                <!-- 懸浮效果 -->
                                <div
                                    v-show="isHoverMap[indexPartItem.indexPartId]"
                                    class="tw-absolute tw-inset-0 tw-border-4 tw-border-primary/80 tw-rounded-xl tw-transition-all tw-duration-300"
                                ></div>
                                <!-- 添加標註覆蓋層 -->
                                <div class="tw-absolute tw-top-4 tw-left-4 tw-flex tw-gap-2">
                                    <q-chip
                                        color="primary"
                                        text-color="white"
                                        class="tw-backdrop-blur-sm"
                                    >
                                        {{ indexPartTypeNameMap[indexPartItem.indexPartType] }}
                                    </q-chip>

                                    <q-chip
                                        :color="
                                            indexPartItem.indexPartStyle ===
                                            IndexPartStyleEnum.STYLE_A
                                                ? 'secondary'
                                                : 'warning'
                                        "
                                        text-color="white"
                                        class="tw-backdrop-blur-sm"
                                    >
                                        樣式
                                        {{ indexPartItem.indexPartStyle.replace('STYLE_', '') }}
                                    </q-chip>
                                </div>
                                <div class="tw-absolute tw-bottom-4 tw-right-1">
                                    <q-chip color="blue" text-color="white">
                                        {{ indexPartItem.customName }}
                                    </q-chip>
                                </div>
                            </div>
                        </li>
                    </template>
                </ul>

                <!-- 右側控制面板 -->
                <div class="tw-flex-1 tw-shrink-0">
                    <!-- 操作按鈕區 -->
                    <div v-if="isEditable" class="tw-flex tw-justify-end tw-gap-4 tw-mb-6">
                        <template v-if="isEdit">
                            <q-btn
                                class="add-btn tw-backdrop-blur-sm tw-transition-all"
                                @click="openAddDialog"
                            >
                                <q-icon name="add" class="tw-mr-1" />
                                新增區塊
                            </q-btn>
                            <q-btn
                                flat
                                :disable="isSaving"
                                class="cancel-btn tw-backdrop-blur-sm tw-transition-all"
                                @click="onCancel"
                            >
                                <q-icon name="close" class="tw-mr-1" />
                                取消
                            </q-btn>
                            <q-btn
                                :loading="isSaving"
                                :disable="isSame"
                                class="save-btn tw-backdrop-blur-sm tw-transition-all"
                                @click="onSave"
                            >
                                <q-icon name="save" class="tw-mr-1" />
                                {{ isSaving ? '保存中' : '保存' }}
                            </q-btn>
                        </template>
                        <template v-else>
                            <q-btn
                                class="edit-btn tw-backdrop-blur-sm tw-transition-all"
                                @click="onEdit"
                            >
                                <q-icon name="edit" class="tw-mr-1" />
                                編輯
                            </q-btn>
                        </template>
                    </div>

                    <!-- 列表項目 -->
                    <q-list class="tw-space-y-4">
                        <!-- 樣式選擇器 -->
                        <q-item
                            class="tw-border tw-border-gray-200/80 tw-rounded-xl tw-h-12 tw-px-4 tw-py-2 tw-mb-[10px] tw-backdrop-blur-sm hover:tw-shadow-md tw-transition-all"
                        >
                            <q-item-section>
                                <q-toolbar>
                                    <q-toolbar-title>
                                        <span class="text-grey800 ellipsis">權限管理</span>
                                    </q-toolbar-title>
                                    <template v-if="isEdit">
                                        <div class="flex tw-gap-2">
                                            <q-btn
                                                @click="updatePermission(true)"
                                                :color="indexPartInfo.isCentral ? 'primary' : ''"
                                                :text-color="
                                                    indexPartInfo.isCentral ? 'white' : 'black'
                                                "
                                            >
                                                最高權限
                                            </q-btn>
                                            <q-btn
                                                @click="updatePermission(false)"
                                                :color="!indexPartInfo.isCentral ? 'primary' : ''"
                                                :text-color="
                                                    !indexPartInfo.isCentral ? 'white' : 'gray'
                                                "
                                            >
                                                一般權限
                                            </q-btn>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <q-separator color="grey500" spaced vertical />
                                        <div class="tw-ps-2">
                                            <span class="text-grey600 tw-mr-2">目前權限：</span>
                                            <q-chip
                                                :color="
                                                    indexPartInfo.isCentral
                                                        ? 'primary'
                                                        : 'secondary'
                                                "
                                                text-color="white"
                                                :label="
                                                    indexPartInfo.isCentral
                                                        ? '最高權限'
                                                        : '一般權限'
                                                "
                                            />
                                        </div>
                                        <q-separator color="grey500" spaced vertical />
                                    </template>
                                </q-toolbar>
                            </q-item-section>
                        </q-item>

                        <!-- 拖拽列表 -->
                        <Draggable
                            v-if="displayIndexPartList.length > 0"
                            v-model="displayIndexPartList"
                            :animation="300"
                            handle=".dragHandler"
                            item-key="indexPartId"
                            class="tw-space-y-3"
                            @end="onDragEnd"
                        >
                            <template #item="{ element, index }">
                                <q-item
                                    :key="`block_${index}`"
                                    :class="{
                                        'tw-bg-gray-100': isHoverMap[element.indexPartId]
                                    }"
                                    class="tw-cursor-pointer tw-border tw-rounded tw-mb-[10px]"
                                    style="padding: 0"
                                    @mouseleave="onItemHover(element.indexPartId, false)"
                                    @mouseover="onItemHover(element.indexPartId, true)"
                                >
                                    <q-item-section>
                                        <q-toolbar class="toolbar_list">
                                            <q-icon
                                                v-if="isEdit"
                                                class="dragHandler text-subtle-2"
                                                name="drag_indicator"
                                                size="24px"
                                                style="cursor: move"
                                            />
                                            <q-toolbar-title class="flex items-center">
                                                <div class="tw-shrink-0 tw-min-w-[320px]">
                                                    <span class="text-grey800 ellipsis mr-2">
                                                        {{
                                                            indexPartTypeNameMap[
                                                                element.indexPartType as keyof typeof indexPartTypeNameMap
                                                            ]
                                                        }}
                                                    </span>
                                                    <span v-if="element.customName"
                                                        >（{{ element.customName }}）</span
                                                    >
                                                    <q-icon name="info" size="18px" color="primary">
                                                        <q-tooltip class="bg-warning">
                                                            <div>
                                                                <span
                                                                    >ID:
                                                                    {{ element.indexPartId }}</span
                                                                >
                                                            </div>
                                                        </q-tooltip>
                                                    </q-icon>
                                                    <span v-if="element.isCentral">
                                                        <q-chip
                                                            label="最高權限管理"
                                                            :square="false"
                                                            color="grey600"
                                                            size="12px"
                                                        />
                                                    </span>
                                                </div>
                                            </q-toolbar-title>
                                            <template v-if="isEdit">
                                                <q-btn-toggle
                                                    v-model="element.indexPartStyle"
                                                    :options="[
                                                        {
                                                            label: 'A',
                                                            value: IndexPartStyleEnum.STYLE_A
                                                        },
                                                        {
                                                            label: 'B',
                                                            value: IndexPartStyleEnum.STYLE_B
                                                        }
                                                    ]"
                                                    class="tw-border tw-border-dark tw-mr-4"
                                                    padding="4px 24.5px"
                                                    toggle-color="dark"
                                                    unelevated
                                                />
                                                <FormToggle
                                                    v-model="element.status"
                                                    :false-value="IndexPartStatusEnum.DISABLE"
                                                    :label="
                                                        element.status ===
                                                        IndexPartStatusEnum.ENABLE
                                                            ? '顯示'
                                                            : '隱藏'
                                                    "
                                                    :true-value="IndexPartStatusEnum.ENABLE"
                                                />
                                                <!-- 添加刪除按鈕 -->
                                                <q-btn
                                                    flat
                                                    round
                                                    color="negative"
                                                    icon="delete"
                                                    class="tw-ml-2"
                                                    @click.stop="onDeleteBlock(element.indexPartId)"
                                                >
                                                    <q-tooltip>刪除區塊</q-tooltip>
                                                </q-btn>
                                            </template>
                                            <template v-else>
                                                <q-separator spaced vertical />
                                                <div class="tw-px-2">
                                                    <span class="text-primary tw-mr-2">樣式</span>
                                                    <q-chip
                                                        :label="
                                                            element.indexPartStyle.replace(
                                                                'STYLE_',
                                                                ''
                                                            )
                                                        "
                                                        :color="
                                                            element.indexPartStyle ===
                                                            IndexPartStyleEnum.STYLE_A
                                                                ? 'secondary'
                                                                : 'warning'
                                                        "
                                                        text-color="white"
                                                        class="tw-backdrop-blur-sm"
                                                    >
                                                    </q-chip>
                                                </div>
                                                <q-separator color="grey500" spaced vertical />
                                                <div class="tw-px-2">
                                                    <span class="text-primary tw-mr-2">狀態</span>
                                                    <q-chip
                                                        :label="
                                                            element.status ===
                                                            IndexPartStatusEnum.ENABLE
                                                                ? '顯示'
                                                                : '隱藏'
                                                        "
                                                        :color="
                                                            element.status ===
                                                            IndexPartStatusEnum.ENABLE
                                                                ? 'accent'
                                                                : 'warning'
                                                        "
                                                        text-color="white"
                                                        class="tw-backdrop-blur-sm"
                                                    />
                                                </div>
                                                <q-separator spaced vertical />
                                            </template>
                                        </q-toolbar>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </Draggable>
                    </q-list>
                </div>
            </div>
        </q-card>

        <!-- 添加 Dialog 組件 -->
        <AddImgScrollIntoDialog
            v-model="showAddDialog"
            :next-id="nextId"
            title="新增區塊"
            @submit="onAddBlock"
        />
    </q-page>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import Draggable from 'vuedraggable'
import { useQuasar } from 'quasar'
import FormToggle from '@/components/FormToggle.vue'
import AddImgScrollIntoDialog from '@/components/AddImgScrollIntoDialog.vue'
import { IndexPartStatusEnum, IndexPartStyleEnum, IndexPartTypeEnum } from '@/enum/StatusEnum'
import { imgScrollApi } from '@/services/imgScrollApi'
import type { IndexPartInfo, IndexPartItem } from '@/types/imgScroll'

const q = useQuasar()

const API_BASE_URL = import.meta.env.VITE_API_URL

// 模擬資料
const isEdit = ref(false)
const isEditable = ref(true)
const isSame = ref(true)

// 新增狀態
const isSaving = ref(false)

// 新增的狀態和方法
const showAddDialog = ref(false)
const nextId = ref(1)

// 修改數據加載和保存邏輯
const indexPartInfo = ref<IndexPartInfo>({
    isCentral: false,
    indexPartList: []
})

// 新增原始數據
const originalData = ref(null)

// 模擬圖片資料

// 模擬類型名稱對應
const indexPartTypeNameMap: Record<IndexPartTypeEnum, string> = {
    [IndexPartTypeEnum.CAROUSEL]: '輪播圖',
    [IndexPartTypeEnum.IMAGE_CARD]: '圖片卡',
    [IndexPartTypeEnum.CALENDAR]: '行事曆',
    [IndexPartTypeEnum.BULLETIN]: '公告訊息',
    [IndexPartTypeEnum.POLICY]: '宣傳服務'
}

// 響應式數據
const isHoverMap = ref<Record<number, boolean>>({})
const indexPartRefs = ref<Record<number, any>>({})

// 計算屬性
const displayIndexPartList = ref<IndexPartItem[]>([])

// 加載數據
const loadData = async () => {
    try {
        const data = await imgScrollApi.getData()
        console.log('API 原始響應:', data)

        if (data && data.indexPartList) {
            indexPartInfo.value = {
                isCentral: data.isCentral,
                indexPartList: data.indexPartList
            }

            // 根據權限過濾顯示列表
            displayIndexPartList.value = data.indexPartList.filter((item) => {
                // 如果全局權限是最高權限，顯示所有項目
                if (data.isCentral) {
                    return true
                }
                // 如果全局權限是一般權限，只顯示非最高權限的項目
                return !item.isCentral
            })

            // 更新 hover 狀態
            const newHoverMap: Record<number, boolean> = {}
            displayIndexPartList.value.forEach((item: IndexPartItem) => {
                newHoverMap[item.indexPartId] = false
            })
            isHoverMap.value = newHoverMap

            // 調試日誌
            console.log('更新後的數據:', {
                indexPartInfo: indexPartInfo.value,
                displayList: displayIndexPartList.value,
                hoverMap: isHoverMap.value
            })
        } else {
            console.error('無效的數據格式:', data)
            q.notify({
                type: 'negative',
                message: '數據格式錯誤',
                position: 'top'
            })
        }
    } catch (error) {
        console.error('加載數據錯誤:', error)
        q.notify({
            type: 'negative',
            message: '加載數據失敗',
            position: 'top'
        })
    }
}

// 修改 watch 監聽函數，添加對 indexPartStyle 的變化監聽
watch(
    [displayIndexPartList, () => indexPartInfo.value.isCentral],
    () => {
        // 當任何相關數據變化時，比較當前數據和原始數據
        if (originalData.value) {
            isSame.value =
                JSON.stringify(originalData.value) === JSON.stringify(indexPartInfo.value)
        }
    },
    { deep: true }
)

// 方法
const setIndexPartRefs = (e: any, indexPartId: number) => {
    indexPartRefs.value[indexPartId] = e
}

const onItemHover = (indexPartId: number, hover: boolean) => {
    isHoverMap.value = { ...isHoverMap.value, [indexPartId]: hover }
    setTimeout(() => {
        const target = indexPartRefs.value[indexPartId]
        if (target) {
            target.scrollIntoView({ block: 'center', behavior: 'smooth' })
        }
    }, 0)
}

const getBlockImage = (indexPartId: number, style: IndexPartStyleEnum): string => {
    return imgScrollApi.getStyleImageUrl(indexPartId, style)
}

// 修改 onEdit 函數，確保正確保存原始數據
const onEdit = () => {
    isEdit.value = true
    originalData.value = JSON.parse(JSON.stringify(indexPartInfo.value))
    isSame.value = true
}

const onCancel = () => {
    if (!isSame.value) {
        q.dialog({
            title: '確認取消',
            message: '您有未保存的更改，確定要取消嗎？',
            cancel: true,
            persistent: true
        }).onOk(() => {
            loadData()
            isEdit.value = false
            isSame.value = true
        })
    } else {
        isEdit.value = false
    }
}

const onSave = async () => {
    try {
        isSaving.value = true
        const response = await imgScrollApi.updateData(indexPartInfo.value)

        if (response.success) {
            q.notify({
                type: 'positive',
                message: '保存成功',
                position: 'top',
                timeout: 2000
            })
            isEdit.value = false
            isSame.value = true
            loadData()
        }
    } catch (error) {
        q.notify({
            type: 'negative',
            message: '保存失敗，請稍後重試',
            position: 'top',
            timeout: 2000
        })
    } finally {
        isSaving.value = false
    }
}

// 修改添加區塊方法
const onAddBlock = async (formData: any) => {
    try {
        const newBlock: IndexPartItem = {
            indexPartId: formData.indexPartId,
            indexPartType: formData.indexPartType,
            status: formData.status,
            customName: formData.customName,
            indexPartStyle: IndexPartStyleEnum.STYLE_A,
            isCentral: false
        }

        // 上傳樣式A圖片
        if (formData.styleAImage) {
            await imgScrollApi.uploadStyleImage(
                newBlock.indexPartId,
                'STYLE_A',
                formData.styleAImage
            )
        }

        // 上傳樣式B圖片
        if (formData.styleBImage) {
            await imgScrollApi.uploadStyleImage(
                newBlock.indexPartId,
                'STYLE_B',
                formData.styleBImage
            )
        }

        // 添加新區塊
        const response = await imgScrollApi.addBlock(newBlock)
        if (response.success && response.data) {
            indexPartInfo.value = response.data
            displayIndexPartList.value = response.data.indexPartList

            q.notify({
                type: 'positive',
                message: '新增成功',
                position: 'top'
            })
        }
    } catch (error) {
        q.notify({
            type: 'negative',
            message: '新增失敗',
            position: 'top'
        })
    }
}

// 修改拖拽結束處理函數
const onDragEnd = async () => {
    if (isEdit.value) {
        indexPartInfo.value.indexPartList = [...displayIndexPartList.value]
        isSame.value = JSON.stringify(originalData.value) === JSON.stringify(indexPartInfo.value)
    }
}

// 在組件掛載時加載數據
onMounted(() => {
    loadData()
})

// 在 script setup 中添加新的方法
const getNextId = (): number => {
    if (!indexPartInfo.value?.indexPartList?.length) return 1
    const maxId = Math.max(...indexPartInfo.value.indexPartList.map((item) => item.indexPartId))
    return maxId + 1
}

// 修改打開對話框的處理方法
const openAddDialog = () => {
    nextId.value = getNextId()
    showAddDialog.value = true
}

// 修改 onDeleteBlock 方法
const onDeleteBlock = async (indexPartId: number) => {
    try {
        q.dialog({
            title: '確認刪除',
            message: '確定要刪除此區塊嗎？此操作無法復原。',
            persistent: true,
            ok: {
                color: 'negative',
                label: '刪除'
            },
            cancel: {
                flat: true,
                label: '取消'
            }
        }).onOk(async () => {
            const response = await imgScrollApi.deleteBlock(indexPartId)
            if (response.success && response.data) {
                // 更新數據
                indexPartInfo.value = response.data
                displayIndexPartList.value = response.data.indexPartList

                q.notify({
                    type: 'positive',
                    message: '刪除成功',
                    position: 'top'
                })
            }
        })
    } catch (error) {
        console.error('刪除失敗:', error)
        q.notify({
            type: 'negative',
            message: '刪除失敗',
            position: 'top'
        })
    }
}

const handleImageError = (event: Event, indexPartId: number, style: string) => {
    const img = event.target as HTMLImageElement
    const currentFormat = img.src.split('.').pop()
    const formats = ['jpg', 'png', 'gif', 'svg']

    // 找到當前格式的索引
    const currentIndex = formats.indexOf(currentFormat || '')

    // 如果還有下一個格式可以嘗試
    if (currentIndex < formats.length - 1) {
        const nextFormat = formats[currentIndex + 1]
        img.src = `${API_BASE_URL}/api/uploads/imgStyles/${indexPartId}_${style}.${nextFormat}`
    } else {
        // 如果所有格式都試過了，顯示預設圖片
        img.src = 'https://picsum.photos/1000/500' // 或其他預設圖片
    }
}

const updatePermission = async (isCentral: boolean) => {
    try {
        const response = await imgScrollApi.updatePermission(isCentral)
        if (response.success && response.data) {
            indexPartInfo.value = response.data
            q.notify({
                type: 'positive',
                message: '權限更新成功',
                position: 'top'
            })
        }
    } catch (error) {
        console.error('更新權限失敗:', error)
        q.notify({
            type: 'negative',
            message: '更新權限失敗',
            position: 'top'
        })
    }
}
</script>

<style lang="scss" scoped>
.q-toolbar {
    height: 48px;
    line-height: 48px;
    padding: 8px 16px;
}
.q-toolbar__title {
    font-size: 16px;
    line-height: 24px;
}

// 更新按鈕樣式
.edit-btn {
    background: linear-gradient(135deg, #1976d2, #2196f3);
    color: white;
    padding: 8px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(25, 118, 210, 0.3);
    }
}

.save-btn {
    background: linear-gradient(135deg, #21ba45, #4caf50);
    color: white;
    padding: 8px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(33, 186, 69, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(33, 186, 69, 0.3);
    }

    &:disabled {
        background: linear-gradient(135deg, #9e9e9e, #bdbdbd);
        box-shadow: none;
    }
}

.cancel-btn {
    color: #757575;
    padding: 8px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;

    &:hover {
        background: linear-gradient(135deg, #f5f5f5, #eeeeee);
        color: #616161;
        transform: translateY(-1px);
    }
}

// 拖拽項目樣式
.draggable-item {
    cursor: move;
    transition: all 0.3s ease;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    &.dragging {
        opacity: 0.8;
        background: rgba(227, 242, 253, 0.9);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
}

// 新增動畫效果
@keyframes float {
    0% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-5px);
    }
    100% {
        transform: translateY(0px);
    }
}

.floating {
    animation: float 3s ease-in-out infinite;
}

// 新增按鈕樣式
.add-btn {
    background: linear-gradient(135deg, #ff9800, #ff5722);
    color: white;
    padding: 8px 20px;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 152, 0, 0.3);
    }
}

// 添加刪除按鈕的樣式
.q-btn[color='negative'] {
    &:hover {
        background: rgba(255, 0, 0, 0.1);
    }
}

.toolbar_list:hover {
    background: linear-gradient(135deg, #5a9bf1, #f1c0b1);
}
</style>
