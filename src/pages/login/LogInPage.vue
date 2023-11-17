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
                    <q-input
                        v-model="credentials.email"
                        color="info"
                        type="email"
                        label="Email"
                    ></q-input>
                    <q-input
                        v-model="credentials.password"
                        color="info"
                        label="Password"
                        :type="showPassword ? 'text' : 'password'"
                    >
                        <template v-slot:append>
                            <q-icon
                                :name="
                                    showPassword
                                        ? 'visibility'
                                        : 'visibility_off'
                                "
                                class="cursor-pointer"
                                @click="showPassword = !showPassword"
                        /></template>
                    </q-input>
                    <q-input
                        v-model="credentials.passwordConfirmation"
                        v-if="!isLogin"
                        color="info"
                        :type="showPassword ? 'text' : 'password'"
                        label="Repeat password"
                    ></q-input>
                    <div>
                        <q-btn
                            class="full-width"
                            color="info"
                            :label="isLogin ? 'Log in' : 'Register'"
                            :loading="userStore.isLoading"
                            @click="submitForm"
                            rounded
                        ></q-btn>
                        <div class="row justify-around q-mt-md">
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
import { ref, reactive } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { LoginCredentials, RegisterData } from '../../contracts/Auth'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { SuccessNotification } from 'src/boot/notifications'

const router = useRouter()
const $q = useQuasar()
const isLogin = ref(true)
const showPassword = ref(false)
const credentials = reactive<LoginCredentials & RegisterData>({
    email: '',
    password: '',
    passwordConfirmation: '',
    remember: true,
})

const userStore = useUserStore()

async function submitForm() {
    if (isLogin.value) {
        const { passwordConfirmation: _, ...loginCred } = credentials
        await userStore.login(loginCred)
        router.push('/')
    } else {
        const { remember: _, ...registerCred } = credentials
        await userStore.register(registerCred)
        SuccessNotification('Successfully registered, please log in.')
        isLogin.value = true
    }
}
</script>
