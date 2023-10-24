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
                <q-item-section avatar>
                    <q-icon color="white" name="fa-solid fa-message" />
                </q-item-section>

                <q-item-section class="text-white">
                    Channel #{{ channel }}
                </q-item-section>
                <q-badge
                    color="info"
                    v-if="channel === 2"
                    align="top"
                    rounded
                />
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
import { reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import CustomDialog from '../CustomDialog.vue'

interface DialogProps {
    title: string
    btnText: string
    isAdd: boolean
}

const dialog = reactive<DialogProps>({
    title: 'New channel',
    btnText: 'Add channel',
    isAdd: true,
})
const route = useRoute()
const activeTab = ref<number>()
const newChannelName = ref<string>('')

watch(route, () => {
    console.log(route.params.id)
    activeTab.value = Number(route.params.id) ?? ''
})

const openDialog = ref(false)
</script>
