import { LoginCredentials, RegisterData } from '../contracts/Auth'
import { authManager, authService } from 'src/services'

import { ChannelSocket } from 'src/boot/socket'
import { LocalStorage } from 'quasar'
import { User } from 'src/contracts'
import { defineStore } from 'pinia'

interface UserState {
    user: User | null
    status: 'pending' | 'success' | 'error'
    onlyMentions: boolean
    errors: { message: string; field?: string[] }[]
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        user: null,
        status: 'pending',
        onlyMentions: LocalStorage.getItem('MENTIONS') ?? false,
        errors: [],
    }),
    getters: {
        getUserActivity: (state) => state.user!.status,
        getUserData: (state) => state.user,
        getMentionsStatus: (state) => state.onlyMentions,
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
                console.log('[INSIDE USER-STORE.TS] went')
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
                LocalStorage.set('STATUS', this.getUserActivity)
                this.setUserActivity(3)
                await authService.logout()
                this.status = 'success'
                authManager.removeToken()
                this.router.replace('/auth/login')
            } catch (errors) {
                this.status = 'error'
                this.errors = errors as typeof this.errors
            }
        },
        setUserActivity(status: 1 | 2 | 3) {
            this.user!.status = status
            ChannelSocket!.emit('updateStatus', status)
        },
        setOnlyMentions(value: boolean) {
            this.onlyMentions = value
            LocalStorage.set('MENTIONS', value)
        },
    },
})
