<template>
	<v-data-table 
		class="border" 
		:items="pins" 
		:headers
		:loading
	>
		<template #item.actions="{ item }">
			<v-btn
				icon="mdi-pencil"
				size="small"
				class="text-blue border"
				elevation="0"
				:disabled="loading"
				@click="emit('edit', item)"
			></v-btn>
			<v-btn
				icon="mdi-delete"
				size="small"
				class="ml-1 text-red border"
				elevation="0"
				:disabled="loading"
				@click="onDelete(item.id)"
			></v-btn>
		</template>
	</v-data-table>
</template>

<script setup lang="ts">
import type { Pin } from "~~/shared/schema/pin"

//

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], edit: [pin: Pin]; delete: [id: number] }>()
const props = defineProps<{ gid: number, mid: number, pins: Pin[] }>()

// --- Arrangement
const headers = [
	{ title: "Pin", value: "number" },
	{ title: "Type", value: "type" },
	{ title: "Mode", key: "mode", sortable: false },
	{ title: "Actions", value: "actions", sortable: false },
]

// --- State
const loading = ref(false)

// --- Store
const { deletePin } = usePinStore()

// --- Actions
const onDelete = async (id: number) => {
	loading.value = true

	const { error, success } = await deletePin(props.gid, props.mid, id)
	loading.value = false

	if (success) emit("delete", id)
	else emit("error", error)
}

//
</script>

<style lang="scss" scoped></style>
