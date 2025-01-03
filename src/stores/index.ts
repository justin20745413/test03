import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        products: [
            { id: 1, name: 'Product 1', price: '$10', image: 1 },
            { id: 2, name: 'Product 2', price: '$20', image: 2 },
            { id: 3, name: 'Product 3', price: '$30', image: 3 }
        ],
        categories: [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
            { id: 3, name: 'Category 3' }
        ],
        isCategoryBarVisible: false
    }),
    actions: {
        toggleCategoryBar() {
            this.isCategoryBarVisible = !this.isCategoryBarVisible
        }
    }
})
