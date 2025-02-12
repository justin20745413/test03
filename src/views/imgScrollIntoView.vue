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
                                            indexPartItem.indexPartType,
                                            indexPartItem.indexPartStyle
                                        )
                                    "
                                    class="tw-w-full tw-rounded-xl tw-shadow-md tw-transition-transform tw-duration-300 tw-relative"
                                />
                                <!-- 懸浮效果 -->
                                <div
                                    v-show="isHoverMap[indexPartItem.indexPartId]"
                                    class="tw-absolute tw-inset-0 tw-border-2 tw-border-primary/80 tw-rounded-xl tw-transition-all tw-duration-300"
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
                                        color="secondary"
                                        text-color="white"
                                        class="tw-backdrop-blur-sm"
                                    >
                                        樣式
                                        {{ indexPartItem.indexPartStyle.replace('STYLE_', '') }}
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
                            class="tw-border tw-border-gray-200/80 tw-rounded-xl tw-h-12 tw-px-4 tw-py-2 tw-mb-[10px] tw-bg-white/80 tw-backdrop-blur-sm hover:tw-shadow-md tw-transition-all"
                        >
                            <q-item-section>
                                <q-toolbar>
                                    <q-toolbar-title>
                                        <span class="text-grey800 ellipsis">頁首及主視覺樣式</span>
                                    </q-toolbar-title>
                                    <template v-if="isEdit">
                                        <div class="flex tw-gap-2">
                                            <q-btn
                                                :class="{
                                                    'bg-primary':
                                                        indexPartInfo.webColor ===
                                                        WebColorEnum.COLOR_A
                                                }"
                                                class="bg-grey-3"
                                                @click="onWebColorChange(WebColorEnum.COLOR_A)"
                                            >
                                                A
                                            </q-btn>
                                            <q-btn
                                                :class="{
                                                    'bg-primary':
                                                        indexPartInfo.webColor ===
                                                        WebColorEnum.COLOR_B
                                                }"
                                                class="bg-grey-3"
                                                @click="onWebColorChange(WebColorEnum.COLOR_B)"
                                            >
                                                B
                                            </q-btn>
                                            <q-btn
                                                :class="{
                                                    'bg-primary':
                                                        indexPartInfo.webColor ===
                                                        WebColorEnum.COLOR_C
                                                }"
                                                class="bg-grey-3"
                                                @click="onWebColorChange(WebColorEnum.COLOR_C)"
                                            >
                                                C
                                            </q-btn>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <q-separator color="grey500" spaced vertical />
                                        <div class="px-2">
                                            <span class="text-grey600 mr-2">頁首樣式</span>
                                            <WebStyleChip :value="indexPartInfo.webStyle" />
                                        </div>
                                        <q-separator color="grey500" spaced vertical />
                                        <div class="ps-2">
                                            <span class="text-grey600 mr-2">主視覺</span>
                                            <WebColorChip :value="indexPartInfo.webColor" />
                                        </div>
                                    </template>
                                </q-toolbar>
                            </q-item-section>
                        </q-item>

                        <!-- 拖拽列表 -->
                        <Draggable
                            v-if="displayIndexPartList.length > 0"
                            v-model="displayIndexPartList"
                            :list="displayIndexPartList"
                            animation="300"
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
                                        <q-toolbar>
                                            <q-icon
                                                v-if="isEdit"
                                                class="dragHandler text-subtle-2"
                                                name="drag_indicator"
                                                size="24px"
                                                style="cursor: move"
                                            />
                                            <q-toolbar-title class="flex items-center">
                                                <div class="tw-shrink-0 tw-min-w-[320px]">
                                                    <span
                                                        :class="{
                                                            'text-primary':
                                                                isHoverMap[element.indexPartId]
                                                        }"
                                                        class="text-grey800 ellipsis mr-2"
                                                    >
                                                        {{
                                                            indexPartTypeNameMap[
                                                                element.indexPartType as keyof typeof indexPartTypeNameMap
                                                            ]
                                                        }}
                                                    </span>
                                                    <span
                                                        :class="{
                                                            'text-primary':
                                                                isHoverMap[element.indexPartId]
                                                        }"
                                                        v-if="element.customName"
                                                        >（{{ element.customName }}）</span
                                                    >
                                                    <q-icon
                                                        name="info"
                                                        size="18px"
                                                        color="primary"
                                                    />
                                                    <span
                                                        v-if="
                                                            adminStore.canViewCentralChip(
                                                                element.isCentral
                                                            )
                                                        "
                                                    >
                                                        <CentralChip
                                                            :square="false"
                                                            color="grey600"
                                                            size="12px"
                                                        />
                                                    </span>
                                                </div>
                                            </q-toolbar-title>
                                            <template v-if="isEdit">
                                                <q-btn-toggle
                                                    v-if="
                                                        adminStore.canEditIndexPartStyle(
                                                            element.isCentral
                                                        )
                                                    "
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
                                            </template>
                                            <template v-else>
                                                <q-separator spaced vertical />
                                                <div class="tw-px-2">
                                                    <span class="text-primary tw-mr-2">樣式</span>
                                                    <q-chip :label="element.indexPartStyle" />
                                                </div>
                                                <q-separator color="grey500" spaced vertical />
                                                <div class="tw-px-2">
                                                    <span class="text-primary tw-mr-2">狀態</span>
                                                    <q-chip :label="element.status" />
                                                </div>
                                                <q-separator spaced vertical />
                                                <ArrowForwardRoundButton
                                                    v-if="
                                                        adminStore.canEditIndexPartStyle(
                                                            element.isCentral
                                                        )
                                                    "
                                                    color="grey800"
                                                    flat
                                                    @click="() => (isEdit = true)"
                                                />
                                                <LockRoundButton
                                                    v-else
                                                    color="grey800"
                                                    disabled
                                                    flat
                                                    tooltip="無法使用"
                                                />
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
    </q-page>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import { useQuasar } from 'quasar'
import FormToggle from '@/components/FormToggle.vue'

const q = useQuasar()

// 模擬枚舉
enum IndexPartStatusEnum {
    ENABLE = 'ENABLE',
    DISABLE = 'DISABLE'
}

enum IndexPartTypeEnum {
    CAROUSEL = 'CAROUSEL',
    IMAGE_CARD = 'IMAGE_CARD',
    CALENDAR = 'CALENDAR',
    BULLETIN = 'BULLETIN',
    POLICY = 'POLICY'
}

enum IndexPartStyleEnum {
    STYLE_A = 'STYLE_A',
    STYLE_B = 'STYLE_B'
}

enum WebStyleEnum {
    STYLE_A = 'STYLE_A',
    STYLE_B = 'STYLE_B'
}

enum WebColorEnum {
    COLOR_A = 'COLOR_A',
    COLOR_B = 'COLOR_B',
    COLOR_C = 'COLOR_C'
}

// 模擬資料
const isEdit = ref(false)
const isEditable = ref(true)
const isSame = ref(true)
const isCurrentAffiliated = ref(false)

// 新增狀態
const isSaving = ref(false)

// 模擬 indexPartInfo
const indexPartInfo = ref({
    webStyle: WebStyleEnum.STYLE_A,
    webColor: WebColorEnum.COLOR_A,
    indexPartList: [
        {
            indexPartId: 1,
            indexPartType: IndexPartTypeEnum.CAROUSEL,
            status: IndexPartStatusEnum.ENABLE,
            customName: '首頁輪播',
            indexPartStyle: IndexPartStyleEnum.STYLE_A,
            isCentral: false
        },
        {
            indexPartId: 2,
            indexPartType: IndexPartTypeEnum.IMAGE_CARD,
            status: IndexPartStatusEnum.ENABLE,
            customName: '圖片專區',
            indexPartStyle: IndexPartStyleEnum.STYLE_B,
            isCentral: false
        },
        {
            indexPartId: 3,
            indexPartType: IndexPartTypeEnum.CALENDAR,
            status: IndexPartStatusEnum.ENABLE,
            customName: '活動日曆',
            indexPartStyle: IndexPartStyleEnum.STYLE_A,
            isCentral: false
        },
        {
            indexPartId: 4,
            indexPartType: IndexPartTypeEnum.BULLETIN,
            status: IndexPartStatusEnum.ENABLE,
            customName: '最新消息',
            indexPartStyle: IndexPartStyleEnum.STYLE_B,
            isCentral: false
        },
        {
            indexPartId: 5,
            indexPartType: IndexPartTypeEnum.POLICY,
            status: IndexPartStatusEnum.ENABLE,
            customName: '宣傳服務',
            indexPartStyle: IndexPartStyleEnum.STYLE_B,
            isCentral: false
        }
    ]
})

// 新增原始數據
const originalData = ref(null)

// 模擬圖片資料
const mockImages: Record<IndexPartTypeEnum, Record<IndexPartStyleEnum, string>> = {
    [IndexPartTypeEnum.CAROUSEL]: {
        [IndexPartStyleEnum.STYLE_A]: 'https://picsum.photos/800/400?random=1',
        [IndexPartStyleEnum.STYLE_B]: 'https://picsum.photos/800/400?random=2'
    },
    [IndexPartTypeEnum.IMAGE_CARD]: {
        [IndexPartStyleEnum.STYLE_A]: 'https://picsum.photos/800/300?random=3',
        [IndexPartStyleEnum.STYLE_B]: 'https://picsum.photos/800/300?random=4'
    },
    [IndexPartTypeEnum.CALENDAR]: {
        [IndexPartStyleEnum.STYLE_A]: 'https://picsum.photos/800/500?random=5',
        [IndexPartStyleEnum.STYLE_B]: 'https://picsum.photos/800/500?random=6'
    },
    [IndexPartTypeEnum.BULLETIN]: {
        [IndexPartStyleEnum.STYLE_A]: 'https://picsum.photos/800/200?random=7',
        [IndexPartStyleEnum.STYLE_B]: 'https://picsum.photos/800/200?random=8'
    },
    [IndexPartTypeEnum.POLICY]: {
        [IndexPartStyleEnum.STYLE_A]: 'https://picsum.photos/800/350?random=9',
        [IndexPartStyleEnum.STYLE_B]: 'https://picsum.photos/800/350?random=10'
    }
}

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
const displayIndexPartList = ref(indexPartInfo.value.indexPartList)

// 修改 watch 監聽函數，添加對 indexPartStyle 的變化監聽
watch(
    [displayIndexPartList, () => indexPartInfo.value.webColor],
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

const getBlockImage = (indexPartType: IndexPartTypeEnum, style: IndexPartStyleEnum): string => {
    return (
        mockImages[indexPartType]?.[style] ||
        mockImages[indexPartType]?.[IndexPartStyleEnum.STYLE_A]
    )
}

// 修改 onEdit 函數，確保正確保存原始數據
const onEdit = () => {
    isEdit.value = true
    // 深拷貝保存原始數據
    originalData.value = JSON.parse(JSON.stringify(indexPartInfo.value))
    isSame.value = true
}

const onCancel = () => {
    // 顯示確認對話框
    if (!isSame.value) {
        q.dialog({
            title: '確認取消',
            message: '您有未保存的更改，確定要取消嗎？',
            cancel: true,
            persistent: true
        }).onOk(() => {
            // 還原數據
            indexPartInfo.value = JSON.parse(JSON.stringify(originalData.value))
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
        // 模擬API調用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 成功提示
        q.notify({
            type: 'positive',
            message: '保存成功',
            position: 'top',
            timeout: 2000
        })

        isEdit.value = false
        isSame.value = true
    } catch (error) {
        // 錯誤提示
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

const onWebColorChange = (color: WebColorEnum) => {
    if (isCurrentAffiliated.value) return
    indexPartInfo.value.webColor = color
}

// 添加拖拽結束處理函數
const onDragEnd = () => {
    // 如果在編輯模式下，更新 isSame 狀態
    if (isEdit.value) {
        isSame.value = JSON.stringify(originalData.value) === JSON.stringify(indexPartInfo.value)
    }
}

// 模擬管理權限
const adminStore = {
    canEditIndexPartStyle: (isCentral: boolean) => !isCentral,
    canViewCentralChip: (isCentral: boolean) => isCentral
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
</style>
