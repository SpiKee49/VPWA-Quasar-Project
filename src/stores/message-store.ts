import AuthManager from 'src/services/AuthManager'
import { SerializedMessage } from '../contracts/Message'
import { Socket } from 'socket.io-client'
import { SocketManager } from 'src/boot/socket'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    //create Maps for channel messages, and individual connections to WS
    channelMessages: Map<number, SerializedMessage[]>
    channelSocket: Socket | null
}

export const useMessageStore = defineStore('messages', {
    state: (): MessageState => ({
        channelMessages: new Map<number, SerializedMessage[]>(),
        channelSocket: null,
    }),
    actions: {
        async initializeChannelsSocket() {
            this.channelSocket = SocketManager.socket('/channels', {
                auth: { token: AuthManager.getToken() },
            })

            this.channelSocket.on('connect', () => {
                console.log('Ws id:' + this.channelSocket?.id)
            })

            const userStore = useUserStore()
            this.channelSocket.emit(
                'joinRooms',
                userStore.user?.channels.map((channel) => channel.id.toString())
            )
        },
    },
})
