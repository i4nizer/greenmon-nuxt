<template>
	<v-card class="border pt-3" :loading>
		<v-card-title class="d-flex">
			<v-icon>mdi-sprout</v-icon>
			<span class="ml-2">{{ greenhouse.name }}</span>
		</v-card-title>
		<v-card-text class="text-grey">
			{{ greenhouse.description }}
		</v-card-text>
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
import { type Greenhouse } from "~~/shared/schema/greenhouse"

//

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], view: [id: number]; edit: [greenhouse: Greenhouse]; delete: [id: number] }>()
const props = defineProps<{ greenhouse: Greenhouse, viewLink: string }>()

// --- State
const error = ref<string>()
const loading = ref(false)

// --- Store
const { deleteGreenhouse } = useGreenhouseStore()

// --- Actions
const onView = async () => {
	loading.value = true
	emit("view", props.greenhouse.id)
	await navigateTo(props.viewLink)
	loading.value = false
}

const onEdit = async () => {
	loading.value = true
	emit("edit", props.greenhouse)
	loading.value = false
}

const onDelete = async () => {
	loading.value = true

	const { error: err, success } = await deleteGreenhouse(props.greenhouse.id)
	error.value = err

	loading.value = false
	if (!success) emit("error", err)
	else emit("delete", props.greenhouse.id)
}

//
</script>

<style scoped></style>
