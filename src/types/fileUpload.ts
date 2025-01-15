import axios from 'axios'

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

// 文件服務類
export class FileService {
    private static apiUrl = import.meta.env.VITE_API_URL

    // 獲取文件列表
    static async fetchFiles(): Promise<FileData[]> {
        try {
            console.log('開始獲取文件列表')
            console.log('API URL:', `${this.apiUrl}/files`)

            const response = await axios.get(`${this.apiUrl}/files`)
            console.log('服務器響應:', response.data)

            return response.data.map((file: APIFileResponse) => ({
                id: file.id,
                name: file.fileName,
                type: file.fileType,
                date: new Date(file.uploadDate).toLocaleDateString(),
                size: this.formatFileSize(file.fileSize),
                uploader: file.uploaderName,
                status: file.status
            }))
        } catch (error: any) {
            console.error('獲取文件列表失敗:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            })
            throw error
        }
    }

    // 文件大小格式化
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    // 獲取狀態顏色
    static getStatusColor(status: string): string {
        switch (status) {
            case '完成':
                return 'secondary'
            case '進行中':
                return 'info'
            case '失敗':
                return 'negative'
            default:
                return 'grey'
        }
    }

    // 刪除文件
    static async deleteFile(id: string): Promise<void> {
        try {
            await axios.delete(`${this.apiUrl}/files/${id}`)
        } catch (error) {
            console.error('刪除文件失敗:', error)
            throw error
        }
    }

    // 下載文件
    static async downloadFile(fileName: string): Promise<Blob> {
        try {
            const response = await axios.get(`${this.apiUrl}/download/${fileName}`, {
                responseType: 'blob'
            })
            return response.data
        } catch (error) {
            console.error('下載文件失敗:', error)
            throw error
        }
    }
}
