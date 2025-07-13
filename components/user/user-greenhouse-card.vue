<template>
    <v-card class="border pt-3" :loading>
        <v-card-title class="d-flex">
            <v-icon>mdi-sprout</v-icon>
            <span class="ml-2">{{ greenhouse.name }}</span>
        </v-card-title>
        <v-card-text class="text-grey">{{ greenhouse.description }}</v-card-text>
        <v-card-actions>
            <v-btn color="green" :disabled="loading" @click="emit('view', greenhouse.id)">
                <v-icon class="mr-1">mdi-cog</v-icon>
                <span v-if="$vuetify.display.smAndUp">View</span>
            </v-btn>
            <slot name="edit-dialog" :="{ props: greenhouse }">
                <v-btn color="blue" :disabled="loading" @click="emit('edit', greenhouse)">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    <span v-if="$vuetify.display.smAndUp">Edit</span>
                </v-btn>
            </slot>
            <v-btn color="red" :disabled="loading" @click="emit('delete', greenhouse.id)">
                <v-icon class="mr-1">mdi-delete</v-icon>
                <span v-if="$vuetify.display.smAndUp">Delete</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { type Greenhouse } from '~/shared/schema/greenhouse';

//

// --- Data Binding
const emit = defineEmits<{ view: [id: number], edit: [greenhouse: Greenhouse], delete: [id: number] }>()
const props = defineProps<{ greenhouse: Greenhouse, loading?: boolean }>()

//

</script>

<style scoped>

</style>