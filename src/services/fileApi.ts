import axios from 'axios'
import type { APIFileResponse } from '../types/fileUpload'

const API_BASE_URL = 'http://localhost:3000/api'

const fileApi = {
    // 獲取檔案列表（加入分頁和排序參數）
    getFiles: async (
        page: number,
        perPage: number,
        sort?: { sortBy: string; sortOrder: 'asc' | 'desc' }
    ) => {
        const response = await axios.get<{
            files: APIFileResponse[]
            total: number
            page: number
            perPage: number
            totalPages: number
        }>(`${API_BASE_URL}/files`, {
            params: {
                page,
                perPage,
                sortBy: sort?.sortBy || 'id',
                sortOrder: sort?.sortOrder || 'desc'
            }
        })
        return response.data
    },

    // 下載檔案
    downloadFile: (fileName: string) => {
        console.log('fileName', fileName)
        return `${API_BASE_URL}/download/${encodeURIComponent(fileName)}`
    },

    // 刪除檔案
    deleteFile: async (fileId: number, page: number, perPage: number) => {
        const response = await axios.delete(`${API_BASE_URL}/files/${fileId}`, {
            params: {
                page,
                perPage
            }
        })
        return response.data
    },

    // 重置 ID 計數器
    resetIdCounter: async () => {
        await axios.post(`${API_BASE_URL}/reset-id`)
    }
}

export { API_BASE_URL, fileApi }
