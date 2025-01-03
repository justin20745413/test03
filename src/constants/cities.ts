interface City {
    name: string
    lat: number
    lon: number
}

export const TAIWAN_CITIES: City[] = [
    { name: '台北', lat: 25.033, lon: 121.5654 },
    { name: '新北', lat: 25.012, lon: 121.4657 },
    { name: '台中', lat: 24.1477, lon: 120.6736 },
    { name: '高雄', lat: 22.6273, lon: 120.3014 },
    { name: '台南', lat: 22.9999, lon: 120.2269 },
    { name: '桃園', lat: 24.9936, lon: 121.301 },
    { name: '新竹', lat: 24.8138, lon: 120.9675 },
    { name: '花蓮', lat: 23.9771, lon: 121.6044 },
    { name: '台東', lat: 22.7583, lon: 121.1444 }
]

export type { City }
