import axios from 'axios'
import type { APIFileResponse } from '../types/fileUpload'

const API_BASE_URL = 'http://localhost:3000/api'

const fileApi = {
    // 獲取檔案列表（加入分頁參數）
    getFiles: async (page: number = 1, perPage: number = 8) => {
        const response = await axios.get<{
            files: APIFileResponse[]
            total: number
            page: number
            perPage: number
            totalPages: number
        }>(`${API_BASE_URL}/files`, {
            params: { page, perPage }
        })
        return response.data
    },

    // 上傳檔案
    uploadFiles: async (files: FormData) => {
        const response = await axios.post<APIFileResponse[]>(`${API_BASE_URL}/upload`, files, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },

    // 下載檔案
    downloadFile: (fileName: string) => {
        return `${API_BASE_URL}/download/${encodeURIComponent(fileName)}`
    },

    // 刪除檔案
    deleteFile: async (fileId: number) => {
        await axios.delete(`${API_BASE_URL}/files/${fileId}`)
    },

    // 重置 ID 計數器
    resetIdCounter: async () => {
        await axios.post(`${API_BASE_URL}/reset-id`)
    }
}

export { API_BASE_URL, fileApi }
