<template>
    <div class="row window-height window-width justify-center items-center">
        <q-card class="q-pa-md" style="width:25%">
            <q-card-section>
                <div>
                    <h2 class="text-h2 text-center text-uppercase q-my-none text-weight-regular">Log in</h2>
                </div>
            </q-card-section>
            <q-card-section>
                <q-form class="q-gutter-md text-white">
                    <q-input color="info" label="Username"></q-input>
                    <q-input color="info" label="Password" type="password"></q-input>
                    <div>
                        <q-btn class="full-width" color="info" label="Log in" rounded></q-btn>
                        <div class="row justify-around q-mt-md" >
                            <router-link class="text-white" to="/login">Zabudnuté heslo?</router-link>
                            <router-link class="text-white" to="/login">Vytvoriť konto</router-link>
                        </div>
                    </div>   
                </q-form>
            </q-card-section>
        </q-card>
    </div>    
</template>


<script setup lang="ts">

</script>

