<template>
    <div class="column justify-center items-center q-px-md">
        <p class="q-pa-md text-h6 bg-dark q-ma-none">Channels</p>

        <q-list dark class="fit q-gutter-md">
            <q-item
                v-for="channel in userStore.getUserChannels"
                :tabindex="channel.id"
                clickable
                :to="`/channels/${channel.id}`"
                @click="messageStore.setActiveChannel(channel.id)"
                class="q-py-lg"
                :active="messageStore.getActiveChannel === channel.id"
                active-class="bg-info"
            >
                <q-item-section avatar>
                    <q-icon color="white" name="fa-solid fa-message" />
                </q-item-section>

                <q-item-section class="text-white">
                    Channel #{{ channel.name }}
                </q-item-section>
                <!-- <q-badge
                    color="info"
                    align="top"
                    rounded
                /> -->
            </q-item>
        </q-list>
        <q-btn
            color="info"
            icon="fa-solid fa-circle-plus"
            label="Create channel"
            class="q-py-md full-width q-mt-md"
            @click="
                () => {
                    openDialog = true
                    dialog.title = 'New channel'
                    dialog.btnText = 'Add channel'
                    dialog.isAdd = true
                }
            "
        />
        <q-btn
            color="info"
            label="Join channel"
            class="q-py-md full-width q-mt-md"
            @click="
                () => {
                    openDialog = true
                    dialog.title = 'Join channel'
                    dialog.isAdd = false
                }
            "
        />
    </div>
    <CustomDialog
        v-model:dialog-value="openDialog"
        v-model:toggle-value="isPrivate"
        :title="dialog.title"
        :btn-text="dialog.btnText"
        :hide-btn="!dialog.isAdd"
        :show-toggle="dialog.isAdd"
        :toggle-text="dialog.isAdd ? 'Private channel' : ''"
        :on-click="createChannel"
    >
        <q-input
            v-if="dialog.isAdd"
            color="info"
            dense
            v-model="newChannelName"
            autofocus
            @keyup.enter="openDialog = false"
        />
        <div v-else style="max-height: 200px" class="height-full">
            <q-list>
                <q-item
                    v-for="channel in [
                        1, 2, 4, 5, 5, 6, 67, 5, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                        8,
                    ]"
                    :key="channel"
                    clickable
                    v-ripple
                >
                    <q-item-section avatar>
                        <q-icon color="white" name="fa-solid fa-message" />
                    </q-item-section>
                    <q-item-section>Channel #{{ channel }} name</q-item-section>
                </q-item>
            </q-list>
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import CustomDialog from '../CustomDialog.vue'
import { useMessageStore } from '../../stores/message-store'
import { useUserStore } from '../../stores/user-store'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { WarningNotification } from 'src/boot/notifications'
import { ChannelSocket } from 'src/boot/socket'
import { Channel } from 'src/contracts'

const route = useRoute()

interface DialogProps {
    title: string
    btnText: string
    isAdd: boolean
}
const messageStore = useMessageStore()
const userStore = useUserStore()

onBeforeMount(() => {
    messageStore.joinRooms()
    messageStore.setActiveChannel(+route.params.id)
})

const newChannelName = ref<string>('')
const isPrivate = ref<boolean>(false)
const openDialog = ref(false)

async function createChannel() {
    if (newChannelName.value === '') {
        WarningNotification('Channel name is required for new channel')
        return
    }

    const response = await api.post<Channel>('channels/new', {
        name: newChannelName.value,
        isPrivate: isPrivate.value,
    })

    if (response.status === 200) {
        const newChannel = response.data
        userStore.check()
        ChannelSocket?.emit('joinRooms', [newChannel.id])
    }
}

const dialog = reactive<DialogProps>({
    title: 'New channel',
    btnText: 'Add channel',
    isAdd: true,
})
</script>
