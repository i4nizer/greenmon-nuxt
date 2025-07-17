<template>
	<v-card class="border pt-3">
		<v-card-title class="d-flex text-subtitle-1 text-wrap">
			<span>{{ output.name }}</span>
			<v-spacer></v-spacer>
			<v-icon>{{ output.icon }}</v-icon>
		</v-card-title>
		<v-card-actions>
			<v-card-subtitle v-if="$vuetify.display.smAndUp">Unit: {{ output.unit }}</v-card-subtitle>
			<v-spacer></v-spacer>
			<v-btn size="small" icon="mdi-pencil" color="blue" @click="emit('edit', output)"></v-btn>
			<v-btn size="small" icon="mdi-delete" color="red" @click="emit('delete', output.id)"></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
import type { Output } from "~~/shared/schema/output"

//

// --- Data Binding
const emit = defineEmits<{ edit: [output: Output]; delete: [id: number] }>()
const props = defineProps<{ output: Output }>()

//
</script>

<style scoped></style>
