import { Channel } from './ChannelMessages'

export interface ApiToken {
    type: 'bearer'
    token: string
    expires_at?: string
    expires_in?: number
}

export interface RegisterData {
    userName: string
    email: string
    password: string
    passwordConfirmation: string
}

export interface LoginCredentials {
    email: string
    password: string
    remember: boolean
}

export interface User {
    id: number
    userName: string
    status: 1 | 2 | 3
    email: string
    channels: Channel[]
    createdAt: string
    updatedAt: string
}

export interface DbUser {
    id: number
    user_name: string
    email: string
    channels: Channel[]
    created_at: string
    updated_at: string
}
