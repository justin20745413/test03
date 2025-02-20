import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

const fileApi = {
    // 獲取檔案列表（加入分頁和排序參數）
    getFiles: async (
        page: number,
        perPage: number,
        sort?: { sortBy: string; sortOrder: 'asc' | 'desc' }
    ) => {
        try {
            const response = await axiosInstance.get('/api/files', {
                params: {
                    page,
                    perPage,
                    sortBy: sort?.sortBy || 'id',
                    sortOrder: sort?.sortOrder || 'desc'
                }
            })
            return response.data
        } catch (error) {
            console.error('獲取檔案列表錯誤:', error)
            throw error
        }
    },

    // 下載檔案
    downloadFile: (fileName: string) => {
        console.log('fileName', fileName)
        return `${API_BASE_URL}/api/download/${encodeURIComponent(fileName)}`
    },

    // 刪除檔案
    deleteFile: async (fileId: number, page: number, perPage: number) => {
        const response = await axios.delete(`${API_BASE_URL}/api/files/${fileId}`, {
            params: {
                page,
                perPage
            }
        })
        return response.data
    },

    // 重置 ID 計數器
    resetIdCounter: async () => {
        await axios.post(`${API_BASE_URL}/api/reset-id`)
    },

    // 更新檔案
    updateFile: async (fileId: number, formData: FormData) => {
        const response = await axios.put(`${API_BASE_URL}/api/files/${fileId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    }
}

export { fileApi }
