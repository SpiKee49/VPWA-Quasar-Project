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
                    console.log('dialog', dialog.title)
                }
            "
        />
    </div>
    <CustomDialog
        v-model="openDialog"
        :title="dialog.title"
        :btn-text="dialog.btnText"
        :hide-btn="!dialog.isAdd"
        :show-toggle="dialog.isAdd"
        :toggle-text="dialog.isAdd ? 'Private channel' : ''"
        :on-click="
            () => {
                openDialog = false
                newChannelName = ''
            }
        "
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
const openDialog = ref(false)

const dialog = reactive<DialogProps>({
    title: 'New channel',
    btnText: 'Add channel',
    isAdd: true,
})
</script>
