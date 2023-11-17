import { ChannelSocket } from 'src/boot/socket'
import { SerializedMessage } from '../contracts/Message'
import { api } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    //create Maps for channel messages, and individual connections to WS
    channelMessages: { [key: number]: SerializedMessage[] }
    activeChannelId: number
}

export const useMessageStore = defineStore('messages', {
    state: (): MessageState => ({
        channelMessages: {},
        activeChannelId: 0,
    }),
    getters: {
        getMessages: (state) => {
            const messages = state.channelMessages[state.activeChannelId]
            if (messages == null || messages.length === 0) return []

            return messages.sort((a, b) => a.id - b.id)
        },
        getActiveChannel: (state) => state.activeChannelId,
    },
    actions: {
        joinRooms() {
            const userStore = useUserStore()
            ChannelSocket!.emit(
                'joinRooms',
                userStore.user?.channels.map((channel) => channel.id.toString())
            )
        },
        async loadMessages(channelId: number) {
            const res = await api.post(`channels/${channelId}/messages`)
            const messages = res.data as SerializedMessage[]

            this.channelMessages[channelId] = messages
        },

        appendMessage(channelId: number, message: SerializedMessage) {
            if (message == null) {
                console.log('message undefined')
                return
            }
            this.channelMessages[channelId] = [
                message,
                ...this.channelMessages[channelId],
            ]
        },

        setActiveChannel(channelId: number) {
            this.activeChannelId = channelId
        },
    },
})
