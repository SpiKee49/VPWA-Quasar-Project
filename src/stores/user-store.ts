import { LoginCredentials, RegisterData } from '../contracts/Auth'
import { authManager, authService } from 'src/services'

import { User } from 'src/contracts'
import { defineStore } from 'pinia'

interface UserState {
    user: User | null
    status: 'pending' | 'success' | 'error'
    errors: { message: string; field?: string[] }[]
    userActivity: 'online' | 'dnd' | 'offline'
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        status: 'pending',
        errors: [],
        userActivity: 'online',
    }),
    getters: {
        getUserActivity: (state) => state.userActivity,
        getUserData: (state) => state.user,
        isLoading: (state) => state.status === 'pending',
        isAuthenticated: (state) => state.user !== null,
        getUserChannels: (state) => state.user!.channels,
    },
    actions: {
        async check() {
            try {
                this.status = 'pending'
                this.errors = []
                const user = await authService.me()
                this.status = 'success'
                this.user = user
                console.log('## user-channels ##', user?.channels)
                return user !== null
            } catch (errors) {
                this.status = 'error'
                this.errors = errors as typeof this.errors
            }
        },
        async register(form: RegisterData) {
            try {
                this.status = 'pending'
                this.errors = []
                const user = await authService.register(form)
                this.status = 'success'
                this.user = null
                return user
            } catch (errors) {
                this.status = 'error'
                this.errors = errors as typeof this.errors
            }
        },
        async login(credentials: LoginCredentials) {
            try {
                this.status = 'pending'
                this.errors = []
                const apiToken = await authService.login(credentials)
                this.status = 'success'
                this.user = null
                authManager.setToken(apiToken.token)
                return apiToken
            } catch (errors) {
                this.status = 'error'
                this.errors = errors as typeof this.errors
            }
        },
        async logout() {
            try {
                this.status = 'pending'
                this.errors = []
                await authService.logout()
                this.status = 'success'
                authManager.removeToken()
                this.router.replace('/auth/login')
            } catch (errors) {
                this.status = 'error'
                this.errors = errors as typeof this.errors
            }
        },
        setUserActivity(status: typeof this.userActivity) {
            this.userActivity = status
        },
    },
})
