<template>
    <v-menu open-on-hover>
        <template #activator="{ props: activatorProps }">
            <slot name="activator" :="{ props: activatorProps }"></slot>
        </template>
        <template #default>
            <v-list>
                <v-list-item 
                    link 
                    rounded 
                    title="Edit"
                    @click="emit('edit', sensor)"
                ></v-list-item>
                <v-list-item 
                    link 
                    rounded 
                    title="Delete"
                    @click="emit('delete', sensor.id)"
                ></v-list-item>
                <v-list-item 
                    link 
                    rounded 
                    :title="sensor.disabled ? 'Enable':'Disable'"
                    @click="emit('toggle', sensor)"
                ></v-list-item>
            </v-list>
        </template>
    </v-menu>
</template>

<script setup lang="ts">
import type { Sensor } from '~/shared/schema/sensor';

//

// --- Data Binding
const emit = defineEmits<{ edit: [sensor: Sensor], delete: [id: number], toggle: [sensor: Sensor] }>()
const props = defineProps<{ sensor: Sensor }>()

//

</script>

<style scoped>

</style>