<template>
    <q-page>
        <div
            style="max-height: calc(100vh- 200px); overflow: auto"
            ref="scrollRef"
        >
            <q-infinite-scroll @load="onLoad" :ref="scrollRef" reverse>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="info" size="40px" />
                    </div>
                </template>
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
            </q-infinite-scroll>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { User } from 'src/contracts'
import { useUserStore } from 'src/stores/user-store'
import { useChannelStore } from 'src/stores/channels-store'
import { ref } from 'vue'

const userStore = useUserStore()
const messageStore = useChannelStore()

const scrollRef = ref()

function isFromCurrentUser(author: User) {
    return author.id === userStore.user!.id
}

function hasUserTag(message: string) {
    return message.includes(`@${userStore.user!.userName}`)
}

const onLoad = async (done: any) => {}
</script>
