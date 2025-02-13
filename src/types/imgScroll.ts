import {
    IndexPartStatusEnum,
    IndexPartStyleEnum,
    IndexPartTypeEnum,
    WebColorEnum
} from '@/enum/StatusEnum'

// 區塊數據接口
export interface IndexPartItem {
    indexPartId: number
    indexPartType: IndexPartTypeEnum
    status: IndexPartStatusEnum
    customName: string
    indexPartStyle: IndexPartStyleEnum
    isCentral: boolean
    styleAImage?: string
    styleBImage?: string
}

// 完整數據接口
export interface IndexPartInfo {
    webColor: WebColorEnum
    indexPartList: IndexPartItem[]
}

// API響應接口
export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}
