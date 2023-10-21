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
    </q-layout>
</template>

<script>
import ChannelsComponent from 'components/Channels/ChannelsComponent.vue'
import ProfileComponent from 'components/Profile/ProfileComponent.vue'
import ChannelMembers from 'src/components/Channels/ChannelMembers.vue'
import { ref } from 'vue'

export default {
    components: {
        ChannelsComponent,
        ProfileComponent,
        ChannelMembers,
    },
    setup() {
        const leftDrawerOpen = ref(false)
        const rightDrawerOpen = ref(false)

        return {
            leftDrawerOpen,
            toggleLeftDrawer() {
                leftDrawerOpen.value = !leftDrawerOpen.value
            },

            rightDrawerOpen,
            toggleRightDrawer() {
                rightDrawerOpen.value = !rightDrawerOpen.value
            },
        }
    },
}
</script>
