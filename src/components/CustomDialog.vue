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

            <q-card-actions
                v-if="!hideBtn ?? true"
                :align="btnPosition ?? 'right'"
                class="text-primary"
            >
                <q-btn
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
interface Props {
    modelValue: boolean
    title: string
    btnText?: string
    btnColor?: string
    btnPosition?: 'left' | 'center' | 'right'
    hideBtn?: boolean
    onClick?: () => void
}
defineProps<Props>()
defineEmits(['update:model-value'])
</script>
