import { User } from './Auth'

export interface Channel {
    id: number
    name: string
    is_private: boolean
    created_by: number
    created_at: Date
    updated_at: Date
    owner: User
}
