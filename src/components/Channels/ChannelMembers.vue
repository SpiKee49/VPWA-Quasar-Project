<template>
    <div
        class="row justify-between items-center q-pa-sm bg-info q-ma-none text-bold"
    >
        <p class="q-ma-none">Channel members</p>
        <div class="flex row justify-right">
            <q-btn
                color="white"
                flat
                size="12px"
                icon="fa-solid fa-user-plus"
                @click="showModal = true"
            />
            <q-btn
                color="white"
                flat
                size="12px"
                icon="fa-solid fa-door-open"
                @click="leaveChannel(messageStore.getActiveChannel)"
            />
            <q-btn
                v-if="isOwner"
                color="white"
                flat
                size="12px"
                icon="fa-solid fa-trash"
                @click="deleteChannel(messageStore.getActiveChannel)"
            />
        </div>
    </div>
    <q-list>
        <q-item v-if="channelMembers.length === 0" class="text-center">
            <p class="full-width">-- No members in channel --</p>
        </q-item>
        <q-item
            v-for="member in channelMembers"
            :key="member.id"
            clickable
            v-ripple
        >
            <q-item-section avatar>
                <q-icon
                    :color="
                        member.status == 1
                            ? 'positive'
                            : member.status == 2
                            ? 'negative'
                            : 'grey'
                    "
                    size="sm"
                    name="fa-solid fa-user"
                />
            </q-item-section>
            <q-item-section>@{{ member.userName }}</q-item-section>

            <q-menu
                v-if="isOwner"
                fit
                transition-show="fade"
                transition-hide="fade"
            >
                <q-list flat style="min-width: 200px" class="bg-darker">
                    <q-item
                        clickable
                        v-close-popup
                        class="text-red"
                        @click="
                            kickFromChannel(
                                messageStore.getActiveChannel,
                                member.id,
                                member.userName
                            )
                        "
                    >
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-door-open" />
                        </q-item-section>
                        <q-item-section>Kick</q-item-section>
                    </q-item>
                    <q-item
                        clickable
                        v-close-popup
                        class="text-red"
                        @click="
                            banFromChannel(
                                messageStore.getActiveChannel,
                                member.id,
                                member.userName
                            )
                        "
                    >
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-ban" />
                        </q-item-section>
                        <q-item-section>Ban</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>
        </q-item>
    </q-list>
    <CustomDialog
        v-model:dialog-value="showModal"
        title="Invite people"
        btn-text="Invite"
        :onClick="inviteToChannel"
    >
        <q-input
            v-model="inviteUserName"
            color="info"
            type="text"
            label="Username"
        />
    </CustomDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import CustomDialog from '../CustomDialog.vue'
import { useChannelStore } from '../../stores/channels-store'
import { User } from 'src/contracts/Auth'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user-store'
import { api } from 'src/boot/axios'
import { ChannelSocket } from 'src/boot/socket'
import { ErrorNotification, InfoNotification } from 'src/boot/notifications'

const route = useRoute()
const router = useRouter()
const isOwner = ref<boolean>(false)
const messageStore = useChannelStore()
const userStore = useUserStore()
const showModal = ref(false)
const inviteUserName = ref('')
const channelMembers = ref<User[]>([])

async function fetchMembers() {
    const memembers = await messageStore.loadMembers()
    channelMembers.value = [...memembers]
}

async function leaveChannel(channelId: number) {
    const response = await api.get(`/channels/${channelId}/leave`)

    if (response.status === 200) {
        await userStore.check()
        ChannelSocket!.emit('leaveRoom', channelId)
        router.push('/')
    }
}
async function kickFromChannel(
    channelId: number,
    userId: number,
    userName: string
) {
    const response = await api.put(`/channels/${channelId}/kick`, { userId })

    if (response.status === 200) {
        ChannelSocket!.emit('userLeftChannel', channelId, userName)
        fetchMembers()
    }
}

async function banFromChannel(
    channelId: number,
    userId: number,
    userName: string
) {
    const response = await api.put(`/channels/${channelId}/ban`, { userId })

    if (response.status === 200) {
        ChannelSocket!.emit('userLeftChannel', channelId, userName)
        fetchMembers()
    }
}

async function inviteToChannel() {
    if (inviteUserName.value === '') {
        ErrorNotification('Username cannot be empty')
        return
    }

    if (
        channelMembers.value
            .map((member) => member.userName)
            .includes(inviteUserName.value)
    ) {
        ErrorNotification('User is already member of channel')
        return
    }

    const response = await api.post(
        `channels/${messageStore.getActiveChannel}/invite`,
        { inviteUserName: inviteUserName.value }
    )

    if (response.status === 200) {
        ChannelSocket!.emit(
            'invite',
            inviteUserName.value,
            messageStore.activeChannelId
        )
        InfoNotification('User invited successfully')
        fetchMembers()
        showModal.value = false
        inviteUserName.value = ''
    } else {
        ErrorNotification('There was an error while inviting user to channel')
    }
}

async function deleteChannel(channelId: number) {
    ChannelSocket!.emit('deleteChannel', channelId)
    await userStore.check()
    router.push('/')
}

function getOwner() {
    const foundChannel = userStore.getUserChannels.find(
        (channel) => channel.id === messageStore.activeChannelId
    )
    isOwner.value = foundChannel?.created_by === userStore.getUserData?.id
}

ChannelSocket!.on('statusChanged', (userId: number) => {
    if (channelMembers.value.map((user) => user.id).includes(userId))
        fetchMembers()
})

ChannelSocket!.on('updateMembers', (channelId) => {
    if (messageStore.activeChannelId === channelId) fetchMembers()
})

onMounted(() => {
    fetchMembers()
    getOwner()
})

watch(route, () => {
    fetchMembers()
    getOwner()
})
</script>
