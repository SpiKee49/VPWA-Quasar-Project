import { SerializedMessage } from './Message'

export interface ChannelMessages {
    [key: number]: SerializedMessage[]
}

export interface Channel {
    id: number
    title: string
    created_at: Date
    updated_at: Date
}
