import { ChannelSocket } from 'src/boot/socket'
import { SerializedMessage } from '../contracts/Message'
import { User } from 'src/contracts'
import { api } from 'src/boot/axios'
import { convertToCamel } from 'src/services/AuthService'
import { defineStore } from 'pinia'
import { useUserStore } from './user-store'

interface MessageState {
    channelMessages: { [key: number]: SerializedMessage[] }
    currentlyTypingMessages: { [channelId: number]: Map<string, string> }
    activeChannelId: number
}

export const useChannelStore = defineStore('messages', {
    state: (): MessageState => ({
        channelMessages: {},
        currentlyTypingMessages: {},
        activeChannelId: 0,
    }),
    getters: {
        getMessages: (state) => {
            const messages = state.channelMessages[state.activeChannelId]
            if (messages == null || messages.length === 0) return []

            return messages.sort((a, b) => a.id - b.id)
        },
        getActiveChannel: (state) => state.activeChannelId,
        getTypingMessages: (state) =>
            state.activeChannelId in state.currentlyTypingMessages
                ? state.currentlyTypingMessages[state.activeChannelId]
                : new Map(),
    },
    actions: {
        joinRooms() {
            ChannelSocket!.emit('joinRooms')
        },
        leaveRooms() {
            ChannelSocket!.emit('leaveRooms')
        },

        async loadMessages(channelId: number) {
            const res = await api.post(`channels/${channelId}/messages`)
            const userStore = useUserStore()
            let deleteChannel = false
            const messages = res.data.map((message: any) => {
                if (
                    Math.ceil(
                        Math.abs(+new Date() - +new Date(message.created_at)) /
                            (1000 * 60 * 60 * 24)
                    ) >= 30
                ) {
                    deleteChannel = true
                }
                return {
                    ...message,
                    author: convertToCamel(message.author),
                }
            }) as SerializedMessage[]

            if (deleteChannel) {
                ChannelSocket!.emit('deleteChannel', channelId)
                await userStore.check()
                return
            }

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

        setCurrentlyTypingMessages(
            channelId: number,
            messages: Map<string, string>
        ) {
            console.log('[IN CHANNELS-STORE]', messages)
            this.currentlyTypingMessages[channelId] = messages
        },

        setActiveChannel(channelId: number) {
            this.activeChannelId = channelId
        },
    },
})
