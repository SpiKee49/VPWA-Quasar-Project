<template>
    <div
        class="row justify-between items-center q-pa-sm bg-info q-ma-none text-bold"
    >
        <p class="q-ma-none">Channel members</p>
        <div class="flex row justify-right">
            <q-btn
                color="white"
                flat
                icon="fa-solid fa-user-plus"
                @click="showModal = true"
            />
            <q-btn
                color="white"
                flat
                icon="fa-solid fa-door-open"
                @click="leaveChannel(messageStore.getActiveChannel)"
            />
        </div>
    </div>
    <q-list>
        <q-item class="text-center">
            <p class="full-width">-- No members in channel --</p>
        </q-item>
        <q-item
            v-for="member in channelMembers"
            :key="member.id"
            clickable
            v-ripple
        >
            <q-item-section avatar>
                <q-icon color="white" size="sm" name="fa-solid fa-user" />
            </q-item-section>
            <q-item-section>@{{ member.userName }}</q-item-section>
            <q-menu fit transition-show="fade" transition-hide="fade">
                <q-list flat style="min-width: 200px" class="bg-darker">
                    <q-item clickable v-close-popup class="text-red">
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-door-open" />
                        </q-item-section>
                        <q-item-section>Kick</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup class="text-red">
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-ban" />
                        </q-item-section>
                        <q-item-section> Ban </q-item-section>
                    </q-item>
                </q-list>
            </q-menu>
        </q-item>
    </q-list>
    <CustomDialog
        v-model:dialog-value="showModal"
        title="Invite people"
        btn-text="Invite"
        :onClick="() => {}"
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

const route = useRoute()
const router = useRouter()
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

onMounted(() => {
    fetchMembers()
})

watch(route, fetchMembers)
</script>
