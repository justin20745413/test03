interface WeatherInfo {
    description: string
    icon: string
}

export const WEATHER_MAP: { [key: number]: WeatherInfo } = {
    0: { description: '晴天', icon: '01d' },
    1: { description: '晴時多雲', icon: '02d' },
    2: { description: '多雲', icon: '03d' },
    3: { description: '陰天', icon: '04d' },
    45: { description: '霧', icon: '50d' },
    48: { description: '霧凇', icon: '50d' },
    51: { description: '毛毛雨', icon: '09d' },
    53: { description: '小雨', icon: '09d' },
    55: { description: '中雨', icon: '09d' },
    61: { description: '小雨', icon: '10d' },
    63: { description: '中雨', icon: '10d' },
    65: { description: '大雨', icon: '10d' },
    71: { description: '小雪', icon: '13d' },
    73: { description: '中雪', icon: '13d' },
    75: { description: '大雪', icon: '13d' },
    95: { description: '雷雨', icon: '11d' },
    96: { description: '雷陣雨伴有冰雹', icon: '11d' },
    99: { description: '大雷雨伴有冰雹', icon: '11d' }
}

export type { WeatherInfo }
