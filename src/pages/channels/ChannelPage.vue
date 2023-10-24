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
                    v-for="msg in messages"
                    :bg-color="msg.name === 'me' ? 'positive' : 'info'"
                    :name="msg.name"
                    :text="msg.text"
                    :sent="msg.name === 'me' ? true : false"
                />
            </div>
        </q-infinite-scroll>
    </q-page>
</template>

<script setup lang="ts">
import { MessageType } from '../../types/messageTypes'
import { ref } from 'vue'

const messages = ref<MessageType[]>([
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

const onLoad = () => {}
</script>
