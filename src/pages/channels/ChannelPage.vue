<template>
    <q-page class="column reverse">
        <div class="q-pa-md bg-dark">
            <q-btn flat class="row text-info justify-center items-center">
                <q-spinner-dots color="info" size="1.5rem" :thickness="5" />
                <p class="q-ma-none q-ml-sm">Someone is typing...</p>
            </q-btn>
            <q-input
                @keydown.enter="sendMessage()"
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
        <div class="q-pa-md" style="flex: 1">
            <q-infinite-scroll @load="onLoad" reverse>
                <template v-slot:loading>
                    <div class="row justify-center q-my-md">
                        <q-spinner-dots color="info" size="40px" />
                    </div>
                </template>

                <div style="width: 100%">
                    <q-chat-message
                        v-for="msg in messages"
                        :bg-color="msg.name === 'me' ? 'positive' : 'info'"
                        :name="msg.name"
                        :text="msg.text"
                        :sent="msg.name === 'me' ? true : false"
                    />
                </div>
            </q-infinite-scroll>
        </div>
    </q-page>
</template>

<script setup lang="ts">
type Message = {
    name: string
    text: string[]
}

import { ref } from 'vue'
const inputText = ref('')

const messages = ref<Message[]>([
    {
        name: 'John',
        text: [
            'Hello there!',
            'How are you today?',
            'Did you watch the game last night?',
        ],
    },
    {
        name: 'Alice',
        text: [
            'Hi John!',
            "I'm doing well, thanks for asking.",
            'Yes, I watched the game. It was amazing!',
        ],
    },
    {
        name: 'Bob',
        text: [
            "Hey, what's up?",
            'Any plans for the weekend?',
            'I missed the game, but I heard it was a thriller.',
        ],
    },
    {
        name: 'Eva',
        text: [
            'Hi everyone!',
            'I just got back from a vacation.',
            "It was a fantastic trip. I'll show you some photos later.",
        ],
    },
    {
        name: 'David',
        text: [
            'Welcome back, Eva!',
            "Can't wait to see those photos.",
            'By the way, did you try the local cuisine there?',
        ],
    },
])
function sendMessage() {
    if (inputText.value === '') {
        return
    }
    console.log(inputText)
    messages.value.push({
        name: 'me',
        text: [inputText.value],
    })
    inputText.value = ''
}

const onLoad = () => {}
</script>
