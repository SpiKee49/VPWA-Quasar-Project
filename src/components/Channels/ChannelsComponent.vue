<template>
    <p class="q-pa-md text-h5">Channels</p>
    <div class="column flex-center q-gutter-md">
        <q-btn v-for="channel in [1,2,3,4]" :to="`channels/${channel}`" class="channel-btn q-py-md" color="primary" text-color="info" icon="fa-solid fa-message" :label="`Channel example ${channel}`" />
    </div>
</template>

<script setup>

</script>
