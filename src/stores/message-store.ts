import { ChannelSocket } from 'src/boot/socket'
import { SerializedMessage } from '../contracts/Message'
import { api } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    //create Maps for channel messages, and individual connections to WS
    channelMessages: Map<number, SerializedMessage[]>
}

export const useMessageStore = defineStore('messages', {
    state: (): MessageState => ({
        channelMessages: new Map<number, SerializedMessage[]>(),
    }),
    getters: {
        getMessages: (state) => state.channelMessages,
    },
    actions: {
        initializeChannelsSocket() {
            const userStore = useUserStore()
            ChannelSocket!.emit(
                'joinRooms',
                userStore.user?.channels.map((channel) => channel.id.toString())
            )
        },
        async initiallyLoadMessages(channelId: number) {
            const res = await api.get(`channels/${channelId}/messages`)
            const messages = res.data as SerializedMessage[]

            if (messages.length <= 0) return

            this.channelMessages.set(channelId, messages)
        },

        appendMessage(channelId: number, message: SerializedMessage) {
            this.channelMessages.get(channelId)!.push(message)
        },
    },
})
