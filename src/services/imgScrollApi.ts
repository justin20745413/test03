import axios from 'axios'
import type { IndexPartInfo, IndexPartItem, ApiResponse } from '@/types/imgScroll'

const API_BASE_URL = import.meta.env.VITE_API_URL

const imgScrollApi = {
    // 獲取所有數據
    getData: async (): Promise<IndexPartInfo> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/imgscroll`)
            return response.data
        } catch (error) {
            console.error('獲取數據失敗:', error)
            throw error
        }
    },

    // 更新數據
    updateData: async (data: IndexPartInfo): Promise<ApiResponse<void>> => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/imgscroll`, data)
            return response.data
        } catch (error) {
            console.error('更新數據失敗:', error)
            throw error
        }
    },

    // 添加新區塊
    addBlock: async (blockData: IndexPartItem): Promise<ApiResponse<IndexPartInfo>> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/imgscroll/block`, blockData)
            return response.data
        } catch (error) {
            console.error('添加區塊失敗:', error)
            throw error
        }
    },

    // 刪除區塊
    deleteBlock: async (indexPartId: number): Promise<ApiResponse<IndexPartInfo>> => {
        try {
            const response = await axios.delete(
                `${API_BASE_URL}/api/imgscroll/block/${indexPartId}`
            )
            return response.data
        } catch (error) {
            console.error('刪除區塊失敗:', error)
            throw error
        }
    },

    // 上傳樣式圖片
    uploadStyleImage: async (
        indexPartId: number,
        style: string,
        file: File
    ): Promise<ApiResponse<string>> => {
        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post(
                `${API_BASE_URL}/api/imgscroll/upload/${indexPartId}/${style}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            return response.data
        } catch (error) {
            console.error('上傳圖片失敗:', error)
            throw error
        }
    },

    // 獲取圖片URL
    getStyleImageUrl: (indexPartId: number, style: string): string => {
        const baseUrl = `${API_BASE_URL}/api/uploads/imgStyles/${indexPartId}_${style}`
        const imageFormats = ['jpg', 'png', 'gif', 'svg']
        return baseUrl + '.' + imageFormats[0]
    }
}

export { imgScrollApi }
