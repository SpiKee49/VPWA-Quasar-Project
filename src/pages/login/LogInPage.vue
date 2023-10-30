<template>
    <div class="row window-height window-width justify-center items-center">
        <q-card class="q-pa-md" style="width: 25%" flat>
            <q-card-section>
                <div>
                    <h2
                        class="text-h2 text-center text-uppercase q-my-none text-weight-regular"
                    >
                        {{ isLogin ? 'Log in' : 'Register' }}
                    </h2>
                </div>
            </q-card-section>
            <q-card-section>
                <q-form class="q-gutter-md text-white">
                    <q-input color="info" label="Username"></q-input>
                    <q-input
                        color="info"
                        label="Password"
                        type="password"
                    ></q-input>
                    <q-input
                        v-if="!isLogin"
                        color="info"
                        label="Repeat password"
                        type="password"
                    ></q-input>
                    <div>
                        <q-btn
                            class="full-width"
                            to="/"
                            color="info"
                            :label="isLogin ? 'Log in' : 'Register'"
                            rounded
                        ></q-btn>
                        <div class="row justify-around q-mt-md">
                            <router-link class="text-white" to="/login"
                                >Forgot password?</router-link
                            >
                            <p
                                class="text-white"
                                style="
                                    text-decoration: underline;
                                    cursor: pointer;
                                "
                                @click="isLogin = !isLogin"
                            >
                                {{ isLogin ? 'Register' : 'Log in' }}
                            </p>
                        </div>
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLogin = ref(true)
</script>
