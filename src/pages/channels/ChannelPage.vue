<template>
    <div
        v-if="
            messageStore.getMessages !== undefined &&
            messageStore.getMessages.length > 0
        "
        v-for="(msg, index) in messageStore.getMessages"
        :key="index"
        class="full-width q-pa-sm"
    >
        <q-chat-message
            :bg-color="
                isFromCurrentUser(msg.author)
                    ? 'positive'
                    : hasUserTag(msg.content)
                    ? 'warning'
                    : 'info'
            "
            :name="msg.author.userName"
            :text="[msg.content]"
            :sent="isFromCurrentUser(msg.author)"
        />
    </div>
</template>

<script setup lang="ts">
import { User } from 'src/contracts'
import { useUserStore } from 'src/stores/user-store'
import { useChannelStore } from 'src/stores/channels-store'

const userStore = useUserStore()
const messageStore = useChannelStore()

function isFromCurrentUser(author: User) {
    return author.id === userStore.user!.id
}

function hasUserTag(message: string) {
    return message.includes(`@${userStore.user!.userName}`)
}
</script>
