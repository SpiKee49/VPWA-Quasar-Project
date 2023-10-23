<template>
    <p class="q-pa-sm bg-info q-ma-none text-bold">Channel members</p>
    <q-list>
        <q-item
            v-for="item in [1, 2, 3, 4, 5, 6, 7]"
            :key="item"
            clickable
            v-ripple
        >
            <q-item-section avatar>
                <q-icon color="white" size="sm" name="fa-solid fa-user" />
            </q-item-section>
            <q-item-section>@username{{ item }}</q-item-section>
            <q-menu fit transition-show="fade" transition-hide="fade">
                <q-list flat style="min-width: 200px" class="bg-darker">
                    <q-item clickable v-close-popup class="text-red">
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-door-open" />
                        </q-item-section>
                        <q-item-section> Kick </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup class="text-red">
                        <q-item-section avatar>
                            <q-icon color="red" name="fa-solid fa-ban" />
                        </q-item-section>
                        <q-item-section> Ban </q-item-section>
                    </q-item>
                </q-list>
            </q-menu>
        </q-item>
    </q-list>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.menu-item-icon {
    display: inline-block;
}
</style>
