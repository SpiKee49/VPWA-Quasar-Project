<template>
    <q-dialog
        :model-value="dialogValue"
        @update:model-value="(value) => $emit('update:dialogValue', value)"
    >
        <q-card style="min-width: 500px" flat>
            <q-card-section>
                <div class="text-h6">{{ title }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none"> <slot></slot> </q-card-section>

            <q-card-actions :align="btnPosition ?? 'right'" class="text-white">
                <q-toggle
                    v-if="showToggle ?? false"
                    :model-value="toggleValue"
                    @update:model-value="
                        (value) => $emit('update:toggleValue', value)
                    "
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
interface Props {
    dialogValue: boolean
    toggleValue: boolean
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
defineEmits(['update:dialogValue', 'update:toggleValue'])
</script>
