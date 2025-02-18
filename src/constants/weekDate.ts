interface weekDate {
    label: string
    value: string
    date: string
}

// 獲取本週的日期
const getWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay() || 7 // 將週日的0轉換為7
    const monday = new Date(today) // 複製今天的日期
    monday.setDate(today.getDate() - (currentDay - 1)) // 設置為本週一

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday)
        date.setDate(monday.getDate() + i)
        return {
            label: `星期${['一', '二', '三', '四', '五', '六', '日'][i]}`,
            value: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][
                i
            ],
            date: `${date.getMonth() + 1}/${date.getDate()}`
        }
    })
}

export const WEEK_DATES: weekDate[] = getWeekDates()

export type { weekDate }
