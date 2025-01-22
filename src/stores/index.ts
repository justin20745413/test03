import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
    state: () => ({
        products: [
            {
                id: 1,
                name: 'Product 1',
                price: '$10',
                content:
                    'This 【Product 1】 combines elegant design with practical features, perfect for everyday use or special occasions, adding style and convenience to your life!',
                image: 1
            },
            {
                id: 2,
                name: 'Product 2',
                price: '$20',
                content:
                    'Experience unmatched comfort and style with 【Product 2】, designed to elevate your everyday essentials effortlessly!',
                image: 2
            },
            {
                id: 3,
                name: 'Product 3',
                price: '$30',
                content:
                    '【Product 3】 delivers innovation and quality, making it the ultimate choice for those who value performance and elegance.',
                image: 3
            },
            {
                id: 4,
                name: 'Product 4',
                price: '$40',
                content:
                    'Redefine convenience and sophistication with 【Product 4】, crafted to enhance both your daily routine and special moments!',
                image: 4
            }
        ],
        categories: [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
            { id: 3, name: 'Category 3' },
            { id: 4, name: 'Category 4' }
        ],
        isCategoryBarVisible: false
    }),
    actions: {
        toggleCategoryBar() {
            this.isCategoryBarVisible = !this.isCategoryBarVisible
        }
    }
})
