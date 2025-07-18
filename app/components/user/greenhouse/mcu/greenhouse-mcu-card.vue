<template>
	<v-card class="border pt-3" :loading>
		<v-card-title class="d-flex">
			<v-icon>mdi-chip</v-icon>
			<span class="ml-2">{{ mcu.name }}</span>
		</v-card-title>
		<v-card-text class="text-grey">{{ mcu?.label }}</v-card-text>
		<v-card-actions>
			<v-btn 
				color="green" 
				:disabled="loading" 
				@click="onView"
			>
				<v-icon class="mr-1">mdi-cog</v-icon>
				<span v-if="$vuetify.display.smAndUp">View</span>
			</v-btn>
			<v-btn 
				color="blue" 
				:disabled="loading" 
				@click="onEdit"
			>
				<v-icon class="mr-1">mdi-pencil</v-icon>
				<span v-if="$vuetify.display.smAndUp">Edit</span>
			</v-btn>
			<v-btn 
				color="red" 
				:disabled="loading" 
				@click="onDelete"
			>
				<v-icon class="mr-1">mdi-delete</v-icon>
				<span v-if="$vuetify.display.smAndUp">Delete</span>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script setup lang="ts">
import { type Mcu } from "~~/shared/schema/mcu"

//

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], view: [id: number]; edit: [mcu: Mcu]; delete: [id: number] }>()
const props = defineProps<{ gid: number, mcu: Mcu, viewLink: string }>()

// --- State
const loading = ref(false)

// --- Store
const { deleteMcu } = useMcuStore()

// --- Actions
const onView = async () => {
	loading.value = true
	emit("view", props.mcu.id)
	await navigateTo(props.viewLink)
	loading.value = false
}

const onEdit = async () => {
	loading.value = true
	emit("edit", props.mcu)
	loading.value = false
}

const onDelete = async () => {
	loading.value = true

	const { error: err, success } = await deleteMcu(props.gid, props.mcu.id)

	loading.value = false
	if (!success) emit("error", err)
	else emit("delete", props.mcu.id)
}

//
</script>

<style scoped></style>
