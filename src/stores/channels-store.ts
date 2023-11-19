import { ChannelSocket } from 'src/boot/socket'
import { SerializedMessage } from '../contracts/Message'
import { User } from 'src/contracts'
import { api } from 'src/boot/axios'
import { convertToCamel } from 'src/services/AuthService'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    channelMessages: { [key: number]: SerializedMessage[] }
    activeChannelId: number
}

export const useChannelStore = defineStore('messages', {
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
            const messages = res.data.map((message: any) => {
                return { ...message, author: convertToCamel(message.author) }
            }) as SerializedMessage[]

            this.channelMessages[channelId] = messages
        },

        getChannelById(channelId: number) {
            const userStore = useUserStore()

            const channel = userStore.getUserChannels.find(
                (channel) => channel.id === channelId
            )
            return channel
        },

        async loadMembers() {
            const res = await api.get(
                `channels/${this.activeChannelId}/members`
            )
            const members = res.data.map((member: any) =>
                convertToCamel(member)
            )

            return members as User[]
        },

        appendMessage(channelId: number, message: any) {
            if (message == null) {
                console.log('message undefined')
                return
            }
            this.channelMessages[channelId] = [
                message,
                ...this.channelMessages[channelId],
            ]
        },

        deleteMessages(channelId: number) {
            //delete saved messages form channel
            delete this.channelMessages[channelId]

            //leave room, user is no longer part of
            ChannelSocket!.emit('leaveChannel', channelId)
        },

        setActiveChannel(channelId: number) {
            this.activeChannelId = channelId
        },
    },
})
