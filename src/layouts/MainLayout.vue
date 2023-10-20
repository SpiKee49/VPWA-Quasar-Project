<template>
  <q-layout view="lHh LpR lFr">

    <q-header bordered="" class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Dačo take jak Discord
        </q-toolbar-title>
 
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above persistent overlay no-swipe-close no-swipe-open :model-value="true" side="left" behavior="desktop" bordered>
      <ChannelsComponent/>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay behavior="desktop">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import ChannelsComponent from 'components/Channels/ChannelsComponent.vue'
import { ref } from 'vue'

export default {
  components:{
    ChannelsComponent
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },

      rightDrawerOpen,
      toggleRightDrawer () {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>