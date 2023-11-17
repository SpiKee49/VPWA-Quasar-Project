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
                            isFromCurrentUser(msg.author) ? 'positive' : 'info'
                        "
                        :name="msg.author.email"
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
import { useMessageStore } from 'src/stores/message-store'
import { ref, onBeforeMount } from 'vue'

const userStore = useUserStore()
const messageStore = useMessageStore()

const scrollRef = ref()
onBeforeMount(() => {
    messageStore.loadMessages(messageStore.getActiveChannel)
})

function isFromCurrentUser(author: User) {
    return author.id === userStore.user!.id
}

const onLoad = async (done: any) => {}
</script>
