<template>
    <div ref="chartRef" class="weather-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
    latitude: number
    longitude: number
}>()

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const fetchForecastData = async () => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}&hourly=temperature_2m&timezone=Asia%2FTaipei`
        )

        if (!response.ok) throw new Error('無法獲取預報數據')

        const data = await response.json()
        const temps = data.hourly.temperature_2m.slice(0, 24) // 只取未來24小時
        const times = data.hourly.time.slice(0, 24).map((time: string) => {
            return new Date(time).getHours() + '時'
        })

        initChart(times, temps)
    } catch (error) {
        console.error('獲取預報數據失敗：', error)
    }
}

const initChart = (times: string[], temperatures: number[]) => {
    if (!chartRef.value) return

    chart = echarts.init(chartRef.value)
    const option = {
        title: {
            text: '24小時溫度預報',
            left: 'center',
            textStyle: {
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c}°C'
        },
        xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
                interval: 3
            }
        },
        yAxis: {
            type: 'value',
            name: '溫度 (°C)',
            axisLabel: {
                formatter: '{value}°C'
            }
        },
        series: [
            {
                data: temperatures,
                type: 'line',
                smooth: true,
                name: '溫度',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#4a90e2'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(74, 144, 226, 0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(74, 144, 226, 0.1)'
                        }
                    ])
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    }

    chart.setOption(option)
}

onMounted(() => {
    fetchForecastData()
    window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
    chart?.dispose()
    window.removeEventListener('resize', () => chart?.resize())
})
</script>

<style scoped>
.weather-chart {
    width: 100%;
    height: 300px;
    margin-top: 2rem;
    background: white;
    border-radius: 12px;
    padding: 1rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>
