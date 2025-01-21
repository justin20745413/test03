// 文件數據接口
export interface FileData {
    id: number
    name: string
    originalName: string
    type: string
    size: string
    uploader: string
    status: string
    uploadDate: string
}

// API 響應接口
export interface APIFileResponse {
    id: number
    fileName: string
    originalName: string
    fileType: string
    uploadDate: string
    fileSize: number
    uploaderName: string
    status: string
}

// 添加分頁響應接口
export interface PaginatedResponse {
    files: APIFileResponse[]
    total: number
    page: number
    totalPages: number
}
