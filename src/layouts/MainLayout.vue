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
            <ChannelMembers />
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>
        <q-footer v-model="showFooter" reveal>
            <Footer />
        </q-footer>
    </q-layout>
</template>

<script setup>
import ChannelsComponent from 'components/Channels/ChannelsComponent.vue'
import ProfileComponent from 'components/Profile/ProfileComponent.vue'
import ChannelMembers from 'src/components/Channels/ChannelMembers.vue'
import Footer from 'src/components/Footer.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user-store'
import { useMessageStore } from '../stores/message-store'

//Stores
const userStore = useUserStore()
const messageStore = useMessageStore()

const rightDrawerOpen = ref(false)
const showFooter = ref(false)
const route = useRoute()
const displayFooter = () => {
    if (route.fullPath.includes('channels')) {
        showFooter.value = true
    } else {
        showFooter.value = false
    }
}
onMounted(() => {
    displayFooter()
})
watch(route, displayFooter)

function toggleRightDrawer() {
    rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
