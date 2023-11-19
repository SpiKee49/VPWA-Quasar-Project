import type {
    ApiToken,
    DbUser,
    LoginCredentials,
    RegisterData,
    User,
} from 'src/contracts'
import type { AxiosError, AxiosRequestConfig } from 'axios'

import { api } from 'src/boot/axios'

export function convertToCamel(user: DbUser): User {
    return {
        id: user.id,
        userName: user.user_name,
        email: user.email,
        channels: user.channels,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
    }
}

class AuthService {
    async me(dontTriggerLogout = false): Promise<User | null> {
        return api
            .get('auth/me', { dontTriggerLogout } as AxiosRequestConfig)
            .then((response) => convertToCamel(response.data))
            .catch((error: AxiosError) => {
                if (error.response?.status === 401) {
                    return null
                }

                return Promise.reject(error)
            })
    }

    async register(data: RegisterData): Promise<User> {
        const response = await api.post<User>('auth/register', data)
        return response.data
    }

    async login(credentials: LoginCredentials): Promise<ApiToken> {
        const response = await api.post<ApiToken>('auth/login', credentials)
        return response.data
    }

    async logout(): Promise<void> {
        await api.post('auth/logout')
    }
}

export default new AuthService()
