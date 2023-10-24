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
            @keydown.enter="() => {}"
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
    <CustomDialog v-model="dialogOpen" title="Currently typing">
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
