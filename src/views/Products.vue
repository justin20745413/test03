<template>
    <div class="q-pa-md">
        <!-- Pokemon列表 -->
        <div class="row q-col-gutter-lg">
            <div
                v-for="pokemon in displayedPokemons"
                :key="pokemon.id"
                class="col-12 col-sm-6 col-md-3"
            >
                <q-card class="pokemon-card" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                    <q-img
                        :src="pokemon.image"
                        :ratio="1"
                        class="pokemon-image"
                        :class="[
                            $q.dark.isActive ? 'dark-mode-image' : 'light-mode-image',
                            `border-${currentTheme}`
                        ]"
                        spinner-color="primary"
                    >
                        <template v-slot:loading>
                            <q-spinner-dots :color="currentTheme" />
                        </template>
                    </q-img>
                    <q-card-section>
                        <div class="text-h6 text-capitalize text-weight-bold">
                            {{ pokemon.name }}
                            <q-badge :color="currentTheme" class="float-right"
                                >#{{ pokemon.id.toString().padStart(3, '0') }}</q-badge
                            >
                        </div>

                        <!-- 類型標籤 -->
                        <div class="q-mt-sm">
                            <q-chip
                                v-for="type in pokemon.types"
                                :key="type"
                                :label="type"
                                size="sm"
                                :color="getPokemonTypeColor(type)"
                                text-color="white"
                            />
                        </div>

                        <!-- 基本信息 -->
                        <div class="text-subtitle2 q-mt-sm row items-center">
                            <div class="col-6">身高: {{ pokemon.height }}m</div>
                            <div class="col-6">體重: {{ pokemon.weight }}kg</div>
                        </div>

                        <!-- 能力值 -->
                        <q-expansion-item
                            group="stats"
                            icon="assessment"
                            :label="'能力值'"
                            :header-class="`text-${currentTheme}`"
                        >
                            <q-card>
                                <q-card-section>
                                    <div
                                        v-for="stat in pokemon.stats"
                                        :key="stat.name"
                                        class="q-mb-sm"
                                    >
                                        <div class="row items-center">
                                            <div class="col-4 text-caption">
                                                {{ formatStatName(stat.name) }}
                                            </div>
                                            <div class="col-8">
                                                <q-linear-progress
                                                    :value="stat.value / 100"
                                                    :color="currentTheme"
                                                    class="q-mt-xs"
                                                />
                                                <div class="text-caption text-right">
                                                    {{ stat.value }}/100
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <!-- 招式 -->
                        <q-expansion-item
                            group="moves"
                            icon="sports_martial_arts"
                            :label="'招式'"
                            :header-class="`text-${currentTheme}`"
                        >
                            <q-card>
                                <q-card-section>
                                    <div
                                        v-for="move in pokemon.moves"
                                        :key="move.name"
                                        class="q-mb-sm"
                                    >
                                        <q-item dense>
                                            <q-item-section>
                                                <q-item-label class="text-capitalize">{{
                                                    move.name
                                                }}</q-item-label>
                                                <q-item-label caption>
                                                    威力: {{ move.power }} | 命中:
                                                    {{ move.accuracy }}% | PP: {{ move.pp }}
                                                </q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </div>
                                </q-card-section>
                            </q-card>
                        </q-expansion-item>

                        <!-- 價格 -->
                        <div class="text-subtitle1 text-primary q-mt-sm">
                            <q-icon name="paid" size="sm" />
                            <span class="q-ml-xs">${{ pokemon.price }}</span>
                        </div>
                    </q-card-section>
                    <q-card-actions align="center" class="q-pb-md">
                        <q-btn
                            :color="currentTheme"
                            class="full-width"
                            icon="add_shopping_cart"
                            label="加入購物車"
                            @click="addToCart(pokemon)"
                            :loading="isAdding[pokemon.id]"
                            :flat="$q.dark.isActive"
                        >
                            <template v-slot:loading>
                                <div
                                    class="loading tw-flex tw-items-center tw-justify-center"
                                ></div>
                            </template>
                        </q-btn>
                    </q-card-actions>
                </q-card>
            </div>
        </div>

        <!-- 分頁控制 -->
        <div class="row justify-center q-mt-xl q-mb-xl">
            <q-pagination
                v-model="currentPage"
                :max="12"
                :max-pages="6"
                direction-links
                boundary-links
                :color="currentTheme"
                active-color="white"
                active-text-color="primary"
            />
        </div>

        <!-- 購物車按鈕 -->
        <q-btn
            class="fixed-bottom-right q-ma-md cart-btn"
            :color="currentTheme"
            round
            size="lg"
            icon="shopping_cart"
            @click="showCart = true"
        >
            <q-badge floating color="negative" rounded class="cart-badge">
                {{ cart.length }}
            </q-badge>
        </q-btn>

        <q-dialog v-model="showCart" position="right">
            <q-card class="cart-dialog" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
                <q-card-section class="row items-center">
                    <div class="text-h6" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
                        <q-icon name="shopping_cart" :color="currentTheme" class="q-mr-sm" />
                        購物車
                    </div>
                    <q-space />
                    <q-btn
                        icon="close"
                        flat
                        round
                        dense
                        v-close-popup
                        :color="$q.dark.isActive ? 'white' : 'dark'"
                    />
                </q-card-section>

                <q-separator :dark="$q.dark.isActive" />

                <q-card-section class="cart-items q-pa-none">
                    <q-list v-if="cart.length" padding separator>
                        <q-item
                            v-for="item in cart"
                            :key="item.id"
                            class="q-py-md cart-item"
                            :class="$q.dark.isActive ? 'text-white' : 'text-dark'"
                        >
                            <q-item-section avatar>
                                <q-avatar rounded>
                                    <img :src="item.image" />
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                <q-item-label class="text-capitalize text-weight-medium">
                                    {{ item.name }}
                                </q-item-label>
                                <q-item-label caption>${{ item.price }}</q-item-label>
                            </q-item-section>
                            <div class="tw-flex tw-items-center">
                                <q-btn
                                    flat
                                    dense
                                    round
                                    icon="remove"
                                    @click="updateQuantity(item, -1)"
                                    color="negative"
                                />
                                <span class="q-mx-sm">{{ item.quantity }}</span>
                                <q-btn
                                    flat
                                    dense
                                    round
                                    icon="add"
                                    @click="updateQuantity(item, 1)"
                                    color="positive"
                                />
                            </div>
                        </q-item>
                    </q-list>
                    <div v-else class="text-center q-pa-xl text-grey-7">
                        <q-icon name="remove_shopping_cart" size="4rem" />
                        <div class="text-h6 q-mt-md">購物車是空的</div>
                    </div>
                </q-card-section>

                <template v-if="cart.length">
                    <q-separator :dark="$q.dark.isActive" />

                    <q-card-section :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
                        <div class="row items-center justify-between">
                            <div class="text-h6">總計:</div>
                            <div class="text-h5" :class="`text-${currentTheme}`">
                                ${{ totalPrice }}
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-actions align="right" class="q-pa-md">
                        <q-btn
                            :color="currentTheme"
                            label="結帳"
                            icon="payment"
                            :flat="$q.dark.isActive"
                            :glossy="!$q.dark.isActive"
                        />
                    </q-card-actions>
                </template>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const pokemons = ref<any[]>([])
const cart = ref<any[]>([]) // 購物車，包含商品和數量
const showCart = ref(false)
const currentPage = ref(1)
const itemsPerPage = 24
const currentTheme = ref('secondary')
const isAdding = ref<Record<number, boolean>>({})

// 計算當前頁面顯示的寶可夢
const displayedPokemons = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return pokemons.value.slice(start, end)
})

// 計算購物車總價
const totalPrice = computed(() => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
})

// 獲取 Pokemon 列表
const fetchPokemons = async () => {
    try {
        const promises = Array.from({ length: 288 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`).then((res) => res.json())
        )

        const results = await Promise.all(promises)
        pokemons.value = results.map((pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
            price: Math.floor(Math.random() * 50),
            types: pokemon.types.map((type: any) => type.type.name),
            height: pokemon.height / 10,
            weight: pokemon.weight / 10,
            stats: pokemon.stats.map((stat: any) => ({
                name: stat.stat.name,
                value: stat.base_stat
            })),
            abilities: pokemon.abilities.map((ability: any) => ability.ability.name),
            moves: pokemon.moves.slice(0, 4).map((move: any) => ({
                name: move.move.name,
                power: Math.floor(Math.random() * 100) + 20,
                accuracy: Math.floor(Math.random() * 30) + 70,
                pp: Math.floor(Math.random() * 15) + 5
            }))
        }))
    } catch (error) {
        console.error('獲取 Pokemon 失敗:', error)
        $q.notify({
            color: 'negative',
            message: '獲取 Pokemon 失敗',
            icon: 'error'
        })
    }
}

// 加入購物車
const addToCart = async (pokemon: any) => {
    if (isAdding.value[pokemon.id]) return

    isAdding.value[pokemon.id] = true
    try {
        const existingItem = cart.value.find((item) => item.id === pokemon.id)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            cart.value.push({ ...pokemon, quantity: 1 })
        }
        $q.notify({
            color: 'positive',
            message: `${pokemon.name} 已加入購物車！`,
            icon: 'shopping_cart'
        })
    } finally {
        isAdding.value[pokemon.id] = false
    }
}

// 從購物車移除
const removeFromCart = (pokemon: any) => {
    const index = cart.value.findIndex((item) => item.id === pokemon.id)
    if (index > -1) {
        cart.value.splice(index, 1)
        $q.notify({
            color: 'negative',
            message: `${pokemon.name} 已從購物車移除`,
            icon: 'delete'
        })
    }
}

// 調整購物車數量
const updateQuantity = (pokemon: any, amount: number) => {
    const item = cart.value.find((item) => item.id === pokemon.id)
    if (item) {
        item.quantity = Math.max(1, item.quantity + amount)
        if (item.quantity === 0) {
            removeFromCart(pokemon)
        }
    }
}

// 監聽頁面變化
watch(currentPage, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
    fetchPokemons()
})

const getPokemonTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
        normal: 'grey-7',
        fire: 'deep-orange',
        water: 'blue',
        grass: 'green',
        electric: 'yellow-8',
        ice: 'light-blue',
        fighting: 'red',
        poison: 'purple',
        ground: 'brown',
        flying: 'indigo',
        psychic: 'pink',
        bug: 'light-green',
        rock: 'brown-6',
        ghost: 'deep-purple',
        dragon: 'deep-purple-7',
        dark: 'grey-9',
        steel: 'blue-grey',
        fairy: 'pink-3'
    }
    return typeColors[type] || 'grey'
}

const formatStatName = (name: string) => {
    const statNames: Record<string, string> = {
        hp: 'HP',
        attack: '攻擊',
        defense: '防禦',
        'special-attack': '特攻',
        'special-defense': '特防',
        speed: '速度'
    }
    return statNames[name] || name
}
</script>

<style lang="scss" scoped>
.pokemon-card {
    border-radius: 12px;
    height: 100%;
    overflow: hidden;
    border-width: 3px;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .pokemon-image {
        width: 200px;
        height: 180px;
        transition: all 0.3s ease;
        border: 3px solid;
        border-radius: 12px;
        margin: 8px auto;
        display: block;
        position: relative;
        z-index: 10;

        &.dark-mode-image {
            background-color: rgba(67, 210, 220, 0.9);
            &:hover {
                background-color: rgba(55, 166, 173, 0.9);
            }
        }

        &:hover {
            transform: scale(1.05);
        }
    }
}

.cart-btn {
    transition: all 0.3s ease;
    margin-bottom: 100px;

    &:hover {
        transform: scale(1.1) rotate(5deg);
    }

    &:active {
        transform: scale(0.95);
    }

    .cart-badge {
        transition: all 0.3s ease;
    }

    &:hover .cart-badge {
        transform: scale(1.2);
    }
}

.cart-badge {
    padding: 4px 6px;
    font-size: 0.8rem;
}

.cart-dialog {
    width: 100%;
    max-width: 400px;
    min-width: 360px;
    height: 100vh;
    border-radius: 0;

    .cart-items {
        height: calc(100vh - 150px);
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: var(--q-primary);
            border-radius: 4px;
        }
    }

    .cart-item {
        transition: all 0.2s ease;

        &:hover {
            background: rgba(0, 0, 0, 0.05);
        }

        .body--dark & {
            &:hover {
                background: rgba(255, 255, 255, 0.05);
            }
        }
    }
}

.q-btn {
    &.flat {
        transition: all 0.2s ease;

        &:hover {
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }
}

// 添加能力值進度條動畫
.q-linear-progress {
    height: 8px;
    border-radius: 4px;
    transition: all 0.3s ease;

    &:hover {
        transform: scaleY(1.2);
    }
}

// 添加展開項過渡效果
.q-expansion-item {
    margin: 8px 0;
    border-radius: 8px;
    overflow: hidden;

    &:hover {
        background: rgba(0, 0, 0, 0.03);
    }

    .body--dark & {
        &:hover {
            background: rgba(255, 255, 255, 0.05);
        }
    }
}
</style>
