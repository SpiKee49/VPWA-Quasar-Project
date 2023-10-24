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
                /></div
        ></q-footer>
    </q-layout>
</template>

<script>
import ChannelsComponent from 'components/Channels/ChannelsComponent.vue'
import ProfileComponent from 'components/Profile/ProfileComponent.vue'
import ChannelMembers from 'src/components/Channels/ChannelMembers.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
    components: {
        ChannelsComponent,
        ProfileComponent,
        ChannelMembers,
    },
    setup() {
        const leftDrawerOpen = ref(false)
        const rightDrawerOpen = ref(false)
        const showFooter = ref(false)
        const route = useRoute()
        watch(route, () => {
            if (route.fullPath.includes('channels')) {
                showFooter.value = true
            } else {
                showFooter.value = false
            }
        })

        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },

            rightDrawerOpen,
            toggleRightDrawer() {
                rightDrawerOpen.value = !rightDrawerOpen.value
            },
            showFooter,
        }
    },
}
</script>
