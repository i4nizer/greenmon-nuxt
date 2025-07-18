<template>
	<v-card class="border pt-3" :loading>
		<v-card-title class="d-flex text-subtitle-1 text-wrap">
			<span>{{ output.name }}</span>
			<v-spacer></v-spacer>
			<v-icon>{{ output.icon }}</v-icon>
		</v-card-title>
		<v-card-subtitle v-if="$vuetify.display.smAndUp">Unit: {{ output.unit }}</v-card-subtitle>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn 
				size="small" 
				icon="mdi-pencil" 
				color="blue" 
				:loading
				@click="emit('edit', output)"
			></v-btn>
			<v-btn 
				size="small" 
				icon="mdi-delete" 
				color="red" 
				:loading
				@click="onDelete"
			></v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
import type { Output } from "~~/shared/schema/output"

//

// --- Data Binding
const emit = defineEmits<{ error: [msg: string]; edit: [output: Output]; delete: [id: number] }>()
const props = defineProps<{ gid: number; mid: number; sid: number; output: Output }>()

// --- State
const loading = ref(false)

// --- Store
const { deleteOutput } = useOutputStore()

// --- Handle
const onDelete = async () => {
	loading.value = true

	const { error, success } = await deleteOutput(props.gid, props.mid, props.sid, props.output.id)

	if (success) emit("delete", props.output.id)
	else emit("error", error)
}

//
</script>

<style scoped></style>
