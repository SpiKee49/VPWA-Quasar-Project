import { ChannelSocket } from 'src/boot/socket'
import { SerializedMessage } from '../contracts/Message'
import { api } from 'src/boot/axios'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    //create Maps for channel messages, and individual connections to WS
    channelMessages: Map<number, SerializedMessage[]>
    activeChannelId: number
}

export const useMessageStore = defineStore('messages', {
    state: (): MessageState => ({
        channelMessages: new Map<number, SerializedMessage[]>(),
        activeChannelId: 0,
    }),
    getters: {
        getMessages: (state) =>
            state.channelMessages.get(state.activeChannelId),
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
            const res = await api.post(`channels/${channelId}/messages`, {
                offset: this.channelMessages.get(channelId)!.length ?? 0,
            })
            const messages = res.data as SerializedMessage[]

            this.channelMessages.set(channelId, messages)
        },

        appendMessage(channelId: number, message: SerializedMessage) {
            if (message == null) {
                console.log('message undefined')
                return
            }

            if (this.channelMessages.has(channelId)) {
                this.channelMessages.get(channelId)!.push(message)
            } else {
                this.channelMessages.set(channelId, [message])
            }
        },
        setActiveChannel(channelId: number) {
            this.activeChannelId = channelId
        },
    },
})
