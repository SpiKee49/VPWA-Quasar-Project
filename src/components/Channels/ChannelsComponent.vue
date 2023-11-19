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
        <q-input
            v-if="!dialog.isAdd"
            color="info"
            dense
            v-model="searchedChannel"
            autofocus
            debounce="500"
            label="Search for channel"
            :loading="loadingChannels"
        />
        <div v-if="!dialog.isAdd" style="max-height: 200px" class="height-full">
            <div
                v-if="joinableChannels.length === 0"
                class="column text-center items-center justify-center"
            >
                <h4>No channels found</h4>
                <p>Try different filter</p>
            </div>
            <q-list>
                <q-item
                    v-for="channel in joinableChannels"
                    :key="channel.id"
                    clickable
                    @click="joinChannel(channel.id)"
                    v-ripple
                >
                    <q-item-section avatar>
                        <q-icon color="white" name="fa-solid fa-message" />
                    </q-item-section>
                    <q-item-section>#{{ channel.name }}</q-item-section>
                </q-item>
            </q-list>
        </div>
    </CustomDialog>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, watch } from 'vue'
import CustomDialog from '../CustomDialog.vue'
import { useChannelStore } from '../../stores/channels-store'
import { useUserStore } from '../../stores/user-store'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { WarningNotification } from 'src/boot/notifications'
import { ChannelSocket } from 'src/boot/socket'
import { Channel } from 'src/contracts'
import { useRouter } from 'vue-router'

interface DialogProps {
    title: string
    btnText: string
    isAdd: boolean
}

const route = useRoute()
const router = useRouter()

const messageStore = useChannelStore()
const userStore = useUserStore()

const newChannelName = ref<string>('')
const searchedChannel = ref<string>('')
const isPrivate = ref<boolean>(false)
const openDialog = ref(false)
const joinableChannels = ref<Channel[]>([])
const loadingChannels = ref(false)

const dialog = reactive<DialogProps>({
    title: 'New channel',
    btnText: 'Add channel',
    isAdd: true,
})

onBeforeMount(() => {
    messageStore.joinRooms()

    fetchChannels()
})

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
        await userStore.check()
        ChannelSocket?.emit('joinRooms', [newChannel.id])
        await messageStore.loadMessages(newChannel.id)
        openDialog.value = false
        router.push(`/channels/${newChannel.id}`)
        messageStore.setActiveChannel(newChannel.id)
    }
}

async function fetchChannels() {
    loadingChannels.value = true

    const res = await api.get<Channel[]>(
        `/channels/joinable${
            searchedChannel.value !== ''
                ? `?search=${searchedChannel.value}`
                : ''
        }`
    )

    const channels = res.data

    if (res.status === 200) {
        loadingChannels.value = false
        joinableChannels.value = [...channels]
    }
}

async function joinChannel(channelId: number) {
    const response = await api.post(`/channels/${channelId}/join`)

    if (response.status === 200) {
        await userStore.check()
        await messageStore.loadMessages(channelId)
        ChannelSocket?.emit('joinRooms', [channelId])
        openDialog.value = false
        router.push(`/channels/${channelId}`)
        messageStore.setActiveChannel(channelId)
    }
}

watch(searchedChannel, fetchChannels)
</script>
