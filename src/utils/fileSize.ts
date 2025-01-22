/**
 * 格式化文件大小
 * @param bytes 文件大小(字節)
 * @returns 格式化後的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 檢查文件大小是否超過限制
 * @param fileSize 文件大小(字節)
 * @param maxSize 最大限制(字節)
 * @returns boolean
 */
export const isFileSizeValid = (fileSize: number, maxSize: number): boolean => {
    return fileSize <= maxSize
}

/**
 * 獲取文件大小單位
 * @param bytes 文件大小(字節)
 * @returns 單位字符串
 */
export const getFileSizeUnit = (bytes: number): string => {
    if (bytes === 0) return 'Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return sizes[i]
}
