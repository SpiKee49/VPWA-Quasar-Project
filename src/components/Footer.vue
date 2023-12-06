<template>
    <div class="q-pa-md bg-dark">
        <q-btn
            v-if="channelStore.getTypingMessages.size > 0"
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
            debounce="1000"
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
                v-for="[username, message] in channelStore.getTypingMessages"
                :name="username"
                :text="[message]"
            />
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import CustomDialog from './CustomDialog.vue'
import { ref, watch } from 'vue'
import { useChannelStore } from '../stores/channels-store'
import { ChannelSocket, emitMessage } from 'src/boot/socket'
import { useUserStore } from '../stores/user-store'

const channelStore = useChannelStore()
const userStore = useUserStore()
const inputText = ref('')
const dialogOpen = ref(false)

function sendMessage() {
    emitMessage(channelStore.getActiveChannel, inputText.value)
    channelStore.appendMessage(channelStore.getActiveChannel, {
        id: Math.max(...channelStore.getMessages.map((msg) => msg.id)) + 1,
        createdBy: userStore.getUserData!.id,
        author: userStore.getUserData!,
        channelId: channelStore.getActiveChannel,
        content: inputText.value,
        createdAt: Date.now().toString(),
        updatedAt: Date.now().toString(),
    })
    inputText.value = ''
}

function currentlyTyping() {
    ChannelSocket!.emit('typing', channelStore.activeChannelId, inputText.value)
}

watch(inputText, currentlyTyping)
watch(channelStore, () => {
    if (channelStore.getTypingMessages.size === 0) dialogOpen.value = false
})
</script>
