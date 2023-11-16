<template>
    <q-page class="fit q-pa-md">
        <q-infinite-scroll ref="scrollRef" @load="onLoad" reverse>
            <template v-slot:loading>
                <div class="row justify-center q-my-md">
                    <q-spinner-dots color="info" size="40px" />
                </div>
            </template>

            <div style="width: 100%">
                <q-chat-message
                    v-for="msg in messageStore.getMessages"
                    :bg-color="
                        isFromCurrentUser(msg.author) ? 'positive' : 'info'
                    "
                    :name="msg.author.email"
                    :text="[msg.content]"
                    :sent="isFromCurrentUser(msg.author)"
                />
            </div>
        </q-infinite-scroll>
    </q-page>
</template>

<script setup lang="ts">
import { User } from 'src/contracts'
import { useUserStore } from 'src/stores/user-store'
import { useMessageStore } from 'src/stores/message-store'

const userStore = useUserStore()
const messageStore = useMessageStore()

function isFromCurrentUser(author: User) {
    return author.id === userStore.user!.id
}

const onLoad = () => {}
</script>
