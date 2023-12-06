import { Manager, Socket } from 'socket.io-client'

import AuthManager from 'src/services/AuthManager'
import { SerializedMessage } from 'src/contracts'
import { boot } from 'quasar/wrappers'
import { convertToCamel } from 'src/services/AuthService'
import { sendNotification } from './notifications'
import { useChannelStore } from '../stores/channels-store'
import { useUserStore } from '../stores/user-store'

const SocketManager: Manager = new Manager(process.env.API_URL)

let ChannelSocket: Socket | null = null

function emitMessage(channelId: number, message: string) {
    if (message === '') return
    ChannelSocket!.emit('addMessage', { channelId, message })
}

export default boot(({ store, router }) => {
    ChannelSocket = SocketManager.socket('/channels', {
        auth: { token: AuthManager.getToken() },
    })
    ChannelSocket.on('connect', () => {
        console.log('Ws id:' + ChannelSocket!.id)
    })
    // chrumkava kasisa
    ChannelSocket.on('connect_error', (err: Error & { data?: any }) => {
        if (err.data?.status === 401) {
            console.log('🚫 Unauthorized, token not valid')
            console.log('⌛ Changing token')
            const unsubscribe = AuthManager.onChange((token) => {
                ChannelSocket!.auth = { token }
                unsubscribe()
                ChannelSocket!.connect()
            })
            console.log('✅ Token updated')
        }
    })

    ChannelSocket!.on('newMessage', ({ channelId, message }) => {
        console.log(`New message in channel ${channelId}`)
        const messageStore = useChannelStore(store)
        const updatedMessage: SerializedMessage = {
            ...message,
            author: convertToCamel(message.author),
        }
        messageStore.appendMessage(channelId, updatedMessage)

        // const title = messageStore.getChannelById(channelId)?.name

        // sendNotification(
        //     `New message in ${title ?? ''}`,
        //     `${updatedMessage.author.userName}: ${updatedMessage.content}`
        // )
    })

    ChannelSocket!.on('channelDeleted', (channelId: number) => {
        const userStore = useUserStore(store)
        const channelStore = useChannelStore(store)
        ChannelSocket!.emit('leaveRoom', channelId)
        userStore.check()
        if (channelStore.activeChannelId === channelId) {
            router.push('/')
        }
    })
})

export { ChannelSocket, emitMessage }
