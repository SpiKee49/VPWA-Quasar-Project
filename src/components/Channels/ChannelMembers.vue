<template>
    <p class="q-pa-sm bg-info q-ma-none text-bold">Channel members</p>
    <q-list>
        <q-item v-for="item in [1,2,3,4,5,6,7]" :key="item" clickable v-ripple>
            <q-item-section avatar>
                <q-icon color="white" size="sm" name="fa-solid fa-user" />
            </q-item-section>
            <q-item-section>@username{{item}}</q-item-section>
        </q-item>
    </q-list>
</template>

<script setup lang="ts">

</script>
