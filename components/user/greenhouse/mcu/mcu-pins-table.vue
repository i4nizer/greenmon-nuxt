<template>
    <v-data-table
        class="border"
        :items="pins"
        :headers="headers"
        :loading="loading"
    >
        <template #item.actions="{ item }">
            <v-btn 
                icon="mdi-pencil"
                size="small" 
                class="text-blue"
                :disabled="loading"
                @click="emit('edit', item)"
            ></v-btn>
            <v-btn 
                icon="mdi-delete"
                size="small" 
                class="ml-1 text-red"
                :disabled="loading"
                @click="emit('delete', item.id)"
            ></v-btn>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import type { Pin } from '~/shared/schema/pin';

//

// --- Data Binding
const emit = defineEmits<{ edit: [pin: Pin], delete: [id: number] }>()
const props = defineProps<{ pins: Pin[], loading?: boolean }>()

// --- Arrangement
const headers = [
    { title: 'Pin', value: 'number' },
    { title: 'Type', value: 'type' },
    { title: 'Mode', key: 'mode', sortable: false },
    { title: 'Actions', value: 'actions', sortable: false },
]

//

</script>

<style lang="scss" scoped>

</style>