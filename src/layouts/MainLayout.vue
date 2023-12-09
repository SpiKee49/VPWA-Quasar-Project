<template>
    <q-layout view="lHh LpR lFr">
        <q-header bordered="" class="bg-info text-white">
            <q-toolbar>
                <q-toolbar-title> Dačo take jak Discord </q-toolbar-title>

                <q-btn
                    dense
                    flat
                    round
                    icon="menu"
                    @click="toggleRightDrawer"
                />
            </q-toolbar>
        </q-header>

        <q-drawer
            show-if-above
            persistent
            no-swipe-close
            no-swipe-open
            :model-value="true"
            side="left"
            behavior="desktop"
            bordered
        >
            <ChannelsComponent />
        </q-drawer>

        <q-drawer v-model="rightDrawerOpen" side="right" behavior="desktop">
            <ProfileComponent />
            <ChannelMembers v-if="showChannelMembers" />
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
        <q-footer v-model="showFooter" reveal>
            <Footer></Footer>
        </q-footer>
    </q-layout>
</template>

<script setup>
import ChannelsComponent from 'components/Channels/ChannelsComponent.vue'
import ProfileComponent from 'components/Profile/ProfileComponent.vue'
import ChannelMembers from 'src/components/Channels/ChannelMembers.vue'
import Footer from 'src/components/Footer.vue'
import { onMounted, ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user-store'
import { useChannelStore } from '../stores/channels-store'
import { LocalStorage } from 'quasar'

//Stores
const userStore = useUserStore()
const messageStore = useChannelStore()
const router = useRouter()
const route = useRoute()

const rightDrawerOpen = ref(false)
const showChannelMembers = ref(false)
const showFooter = ref(false)
const displayFooter = () => {
    if (route.fullPath.includes('channels/')) {
        showFooter.value = true
        showChannelMembers.value = true
    } else {
        showFooter.value = false
        showChannelMembers.value = false
    }
}

function getAccessToChannel() {
    const userHasAccess = userStore.getUserChannels
        .map((channel) => channel.id)
        .includes(+route.params.id)
    messageStore.setActiveChannel(userHasAccess ? +route.params.id : 0)
    if (!userHasAccess) {
        router.push('/')
    }
}

onBeforeMount(() => {
    getAccessToChannel()
})

onMounted(() => {
    displayFooter()
    userStore.getUserChannels.forEach(
        async (channel) => await messageStore.loadMessages(channel.id)
    )
    userStore.setUserActivity(LocalStorage.getItem('STATUS') ?? 1)
})
watch(route, () => {
    displayFooter()
    getAccessToChannel()
})

function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
