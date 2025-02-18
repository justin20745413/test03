<template>
    <div class="weather-container">
        <div class="weather-card">
            <div class="weather-header">
                <h2 class="weather-title">天氣資訊</h2>
                <div class="flex tw-gap-2">
                    <select v-model="selectedDate" class="city-select">
                        <option v-for="date in WEEK_DATES" :key="date.value" :value="date.value">
                            {{ date.label }} --- ({{ date.date }})
                        </option>
                    </select>
                    <select v-model="selectedCity" class="city-select">
                        <option v-for="city in TAIWAN_CITIES" :key="city.name" :value="city">
                            {{ city.name }}
                        </option>
                    </select>
                </div>
            </div>
            <div v-if="isLoading" class="loading">
                <div class="water"></div>
            </div>
            <div v-else-if="weatherData" class="weather-content">
                <div class="current-weather">
                    <div class="city-info">
                        <h3>{{ weatherData.city }}</h3>
                        <div class="temp-display">
                            <span class="current-temp">{{ weatherData.currentTemp }}°</span>
                            <span class="temp-unit">C</span>
                        </div>
                    </div>
                    <div class="weather-details">
                        <div class="detail-item">
                            <img
                                :src="`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`"
                                :alt="weatherData.description"
                                class="weather-icon"
                            />
                            <span>{{ weatherData.description }}</span>
                        </div>
                        <div class="detail-item">
                            <q-icon name="device_thermostat"></q-icon>
                            <span>體感溫度 {{ weatherData.feelsLike }}°C</span>
                        </div>
                        <div class="detail-item">
                            <q-icon name="water_drop"></q-icon>
                            <span>濕度 {{ weatherData.humidity }}%</span>
                        </div>
                        <div class="detail-item">
                            <q-icon name="air"></q-icon>
                            <span>風速 {{ weatherData.windSpeed }} m/s</span>
                        </div>
                    </div>
                </div>
                <WeatherChart
                    :latitude="selectedCity.lat"
                    :longitude="selectedCity.lon"
                    :selected-date="selectedDate"
                />
            </div>
            <div v-else class="error">
                <q-icon name="error"></q-icon>
                <span>無法獲取天氣資料，請稍後再試。</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import WeatherChart from './WeatherChart.vue'
import { TAIWAN_CITIES } from '@/constants/cities'
import { WEEK_DATES } from '@/constants/weekDate'
import { WEATHER_MAP } from '@/constants/weatherCodes'
import type { WeatherData } from '@/types/weather'
import type { City } from '@/constants/cities'
import type { WeatherInfo } from '@/constants/weatherCodes'

const selectedCity = ref<City>(TAIWAN_CITIES[0])
const todayWeekday =
    new Date().getDay() === 0 ? 'sunday' : WEEK_DATES[new Date().getDay() - 1].value
const selectedDate = ref<string>(todayWeekday)
const isLoading = ref(true)
const weatherData = ref<WeatherData | null>(null)

// 根據天氣代碼獲取對應的描述和圖標
const getWeatherInfo = (weatherCode: number): WeatherInfo => {
    return WEATHER_MAP[weatherCode] || { description: '未知天氣', icon: '03d' }
}

const fetchWeatherData = async () => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.value.lat}&longitude=${selectedCity.value.lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,relative_humidity_2m_max,weather_code,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FTaipei`
        )

        if (!response.ok) {
            throw new Error('無法獲取天氣數據')
        }

        const data = await response.json()

        // 獲取選擇的日期在一週中的索引
        const today = new Date().getDay() - 1 // 0 為星期一
        const selectedIndex = WEEK_DATES.findIndex((d) => d.value === selectedDate.value)
        const dayDiff = selectedIndex - today

        // 如果是當天，使用current數據，否則使用daily數據
        if (dayDiff === 0) {
            const weatherInfo = getWeatherInfo(data.current.weather_code)
            weatherData.value = {
                city: selectedCity.value.name,
                currentTemp: Math.round(data.current.temperature_2m),
                description: weatherInfo.description,
                humidity: data.current.relative_humidity_2m,
                icon: weatherInfo.icon,
                windSpeed: data.current.wind_speed_10m,
                feelsLike: Math.round(data.current.apparent_temperature)
            }
        } else {
            // 使用daily數據中對應日期的數據
            const dailyIndex = dayDiff > 0 ? dayDiff : dayDiff + 7

            const weatherInfo = getWeatherInfo(data.daily.weather_code[dailyIndex])
            weatherData.value = {
                city: selectedCity.value.name,
                currentTemp: Math.round(data.daily.temperature_2m_max[dailyIndex]),
                description: weatherInfo.description,
                humidity: data.daily.relative_humidity_2m_max[dailyIndex],
                icon: weatherInfo.icon,
                windSpeed: data.daily.wind_speed_10m_max[dailyIndex],
                feelsLike: Math.round(data.daily.apparent_temperature_max[dailyIndex])
            }
        }

        isLoading.value = false
    } catch (error) {
        console.error('獲取天氣資料失敗：', error)
        isLoading.value = false
        weatherData.value = null
    }
}

// 監聽城市和日期變化
watch([selectedCity, selectedDate], () => {
    isLoading.value = true
    fetchWeatherData()
})

onMounted(() => {
    fetchWeatherData()
})
</script>

<style scoped>
.weather-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.weather-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    transition: all 0.3s ease;
}

.weather-title {
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
}

.weather-content {
    animation: fadeIn 0.5s ease;
}

.current-weather {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--q-primary) 0%, rgb(215, 72, 72) 100%);
    border-radius: 12px;
    color: white;
}

.city-info h3 {
    font-size: 1.4rem;
    margin: 0 0 0.5rem 0;
}

.temp-display {
    display: flex;
    align-items: baseline;
}

.current-temp {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
}

.temp-unit {
    font-size: 1.5rem;
    margin-left: 0.3rem;
}

.weather-details {
    text-align: right;
}

.detail-item {
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.detail-item i {
    width: 24px;
}

.weather-chart {
    width: 100%;
    height: 400px;
    margin-top: 2rem;
    border-radius: 12px;
    overflow: hidden;
}

.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
}

.error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #e74c3c;
    padding: 2rem;
    background: #fdf0ef;
    border-radius: 8px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .current-weather {
        flex-direction: column;
        text-align: center;
        padding: 1rem;
    }

    .weather-details {
        text-align: center;
        margin-top: 1rem;
    }

    .detail-item {
        justify-content: center;
    }

    .weather-chart {
        height: 300px;
    }
}

.weather-icon {
    width: 50px;
    height: 50px;
}

.detail-item {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    backdrop-filter: blur(5px);
}
/* water:  */
.water {
    --r1: 154%;
    --r2: 68.5%;
    width: 60px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #269af2 80%),
        radial-gradient(var(--r1) var(--r2) at bottom, #269af2 79.5%, #0000 80%),
        radial-gradient(var(--r1) var(--r2) at top, #0000 79.5%, #269af2 80%), #ccc;
    background-size: 50.5% 220%;
    background-position:
        -100% 0%,
        0% 0%,
        100% 0%;
    background-repeat: no-repeat;
    animation: l9 2s infinite linear;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
}
@keyframes l9 {
    33% {
        background-position:
            0% 33%,
            100% 33%,
            200% 33%;
    }
    66% {
        background-position:
            -100% 66%,
            0% 66%,
            100% 66%;
    }
    100% {
        background-position:
            0% 100%,
            100% 100%,
            200% 100%;
    }
}

.weather-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

@media (max-width: 600px) {
    .weather-header {
        flex-direction: column;
        gap: 1rem;
    }
}

.city-select {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    background-color: white;
    font-size: 1rem;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s ease;
}

.city-select:hover {
    border-color: #4a90e2;
}

.city-select:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
</style>
