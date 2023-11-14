import { SerializedMessage } from '../contracts/Message'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    channels: { [channelId: number]: SerializedMessage[] }
}

export const useMessageStore = defineStore('messages', {
    state: (): MessageState => ({
        channels: {},
    }),
    actions: {
        initializeChannels() {
            const userStore = useUserStore()

            userStore.user!.channels.forEach((channel) => {

                this.channels[channel.id] = []
            })
        },

    },
})
