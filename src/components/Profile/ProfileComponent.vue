<template>
    <q-card class="my-card" square flat>
        <q-card-section class="bg-info text-white row justify-between">
            <div class="flex-row">
                <p class="text-h6 q-ma-none">{{ userStore.user?.userName }}</p>
                <p class="text-caption">{{ userStore.user?.email }}</p>
                <p
                    class="bg-white text-info text-caption text-center text-bold q-px-md"
                >
                    {{ status[userStore.getUserActivity] }}
                </p>
            </div>
            <q-btn
                color="white"
                flat
                icon="fa-solid fa-right-from-bracket"
                @click="userStore.logout()"
            />
        </q-card-section>
        <q-card-actions align="around" class="q-py-md">
            <q-btn
                color="positive"
                class="text-caption"
                label="Online"
                @click="userStore.setUserActivity('online')"
            />
            <q-btn
                color="negative"
                class="text-caption"
                label="Don't disturb"
                @click="userStore.setUserActivity('dnd')"
            />
            <q-btn
                color="secondary"
                class="text-caption"
                label="Offline"
                @click="userStore.setUserActivity('offline')"
            />
        </q-card-actions>
    </q-card>
    <q-separator />
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user-store'

const status = {
    online: 'Online',
    dnd: 'Do not disturb',
    offline: 'Offline',
}

const userStore = useUserStore()
</script>
