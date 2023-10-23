<template>
    <q-dialog
        :model-value="modelValue"
        @update:model-value="(value) => $emit('update:model-value', value)"
    >
        <q-card style="min-width: 350px" flat>
            <q-card-section>
                <div class="text-h6">Channel name</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-input
                    color="info"
                    dense
                    v-model="newChannel"
                    autofocus
                    @keyup.enter="$emit('update:model-value', false)"
                />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
                <q-btn color="info" text-color="white" label="Add channel" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Props {
    modelValue: boolean
}
defineProps<Props>()
defineEmits(['update:model-value'])

const newChannel = ref<string>('')
</script>
