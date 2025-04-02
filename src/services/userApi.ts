interface User {
    name: string
    email: string
}

export const getUserData = async (): Promise<User[]> => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        const data: User[] = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching user data:', error)
        throw error
    }
}
