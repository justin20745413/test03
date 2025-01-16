// 文件數據接口
export interface FileData {
    id: number
    name: string
    type: string
    date: string
    size: string
    uploader: string
    status: string
}

// API 響應接口
export interface APIFileResponse {
    id: number
    fileName: string
    fileType: string
    uploadDate: string
    fileSize: number
    uploaderName: string
    status: string
}