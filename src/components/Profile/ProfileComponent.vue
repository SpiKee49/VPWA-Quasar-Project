<template>
    <q-card class="my-card" square flat>
        <q-card-section class="bg-info text-white row justify-between">
            <div class="text-h6">{{ userStore.user?.userName }}</div>
            <q-btn
                color="white"
                flat
                icon="fa-solid fa-right-from-bracket"
                @click="userStore.logout()"
            />
        </q-card-section>
        <q-card-actions align="around" class="q-py-md">
            <q-btn color="positive" class="text-caption" label="Online" />
            <q-btn
                color="negative"
                class="text-caption"
                label="Don't disturb"
            />
            <q-btn color="secondary" class="text-caption" label="Offline" />
        </q-card-actions>
    </q-card>
    <q-separator />
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user-store'

const userStore = useUserStore()
</script>
