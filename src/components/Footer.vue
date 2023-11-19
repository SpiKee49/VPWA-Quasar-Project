<template>
    <div class="q-pa-md bg-dark">
        <q-btn
            flat
            class="row text-info justify-center items-center"
            @click="dialogOpen = true"
        >
            <q-spinner-dots color="info" size="1.5rem" :thickness="5" />
            <p class="q-ma-none q-ml-sm">Someone is typing...</p>
        </q-btn>
        <q-input
            @keydown.enter="sendMessage"
            v-model.trim="inputText"
            type="text"
            placeholder="Start typing..."
            autofocus
            square
            filled
            bg-color="darker"
            bordered
            color="white"
            input-style="q-px-md"
            class="text-body1"
        />
    </div>
    <CustomDialog
        v-model:dialog-value="dialogOpen"
        title="Currently typing"
        hide-btn
    >
        <div style="width: 100%; max-height: 350px">
            <q-chat-message
                v-for="msg in messages"
                :bg-color="msg.name === 'me' ? 'positive' : 'info'"
                :name="msg.name"
                :text="msg.text"
                :sent="msg.name === 'me' ? true : false"
            />
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import { MessageType } from 'src/types/messageTypes'
import CustomDialog from './CustomDialog.vue'
import { ref, reactive } from 'vue'
import { useMessageStore } from '../stores/message-store'
import { emitMessage } from 'src/boot/socket'
import { useUserStore } from '../stores/user-store'

const messageStore = useMessageStore()
const userStore = useUserStore()

function sendMessage() {
    emitMessage(messageStore.getActiveChannel, inputText.value)
    messageStore.appendMessage(messageStore.getActiveChannel, {
        id: Math.max(...messageStore.getMessages.map((msg) => msg.id)) + 1,
        createdBy: userStore.getUserData!.id,
        author: userStore.getUserData!,
        channelId: messageStore.getActiveChannel,
        content: inputText.value,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    })
    inputText.value = ''
}
const inputText = ref('')
const dialogOpen = ref(false)
const messages = reactive<MessageType[]>([
    {
        name: 'John Doe',
        text: ['Im currently typing something...'],
    },
    {
        name: 'John Doe2',
        text: ['Im currently typing something too...'],
    },
    {
        name: 'John Doe3',
        text: [
            'Look I know how is this going to look, but Im currently typing something too...',
        ],
    },
    {
        name: 'John Doe4',
        text: ['OKAY, OKAY, SO WHAT? HUH?'],
    },
])
</script>
