<template>
    <div class="column justify-center items-center q-px-md">
        <p class="q-pa-md text-h5 bg-dark q-ma-none">Channels</p>
        <q-separator />
        <q-list dark class="fit q-gutter-md">
            <q-item
                v-for="channel in [1, 2, 3, 4]"
                :tabindex="channel"
                clickable
                :to="`/channels/${channel}`"
                class="q-py-lg"
                :active="activeTab === channel"
                active-class="bg-info"
            >
                <q-item-section avatar
                    ><q-icon color="white" name="fa-solid fa-message"
                /></q-item-section>
                <q-item-section class="text-white">
                    Channel #{{ channel }}
                </q-item-section>
            </q-item>
        </q-list>
        <q-btn
            color="info"
            icon="fa-solid fa-circle-plus"
            label="Create channel"
            class="q-py-md full-width q-mt-md"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const activeTab = ref<number>()
watch(route, () => {
    console.log(route.params.id)
    activeTab.value = Number(route.params.id) ?? ''
})
</script>
