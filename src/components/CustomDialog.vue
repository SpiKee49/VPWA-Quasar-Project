<template>
    <q-dialog
        :model-value="modelValue"
        @update:model-value="(value) => $emit('update:model-value', value)"
    >
        <q-card style="min-width: 500px" flat>
            <q-card-section>
                <div class="text-h6">{{ title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none"> <slot></slot> </q-card-section>

            <q-card-actions :align="btnPosition ?? 'right'" class="text-white">
                <q-toggle
                    v-if="showToggle ?? false"
                    v-model="toggleValue"
                    color="info"
                    :label="toggleText ?? ''"
                    left-label
                />
                <q-btn
                    v-if="!hideBtn ?? true"
                    :color="btnColor ?? 'info'"
                    text-color="white"
                    :label="btnText"
                    @click="onClick"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    modelValue: boolean
    title: string
    btnText?: string
    btnColor?: string
    btnPosition?: 'left' | 'center' | 'right'
    hideBtn?: boolean
    showToggle?: boolean
    toggleText?: string
    onClick?: () => void
}
defineProps<Props>()
defineEmits(['update:model-value'])

const toggleValue = ref(true)
</script>
