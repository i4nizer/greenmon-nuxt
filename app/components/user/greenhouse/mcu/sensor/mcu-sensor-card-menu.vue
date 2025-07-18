<template>
	<v-menu open-on-hover :disabled="loading">
		<template #activator="{ props: activatorProps }">
			<slot name="activator" :="{ props: { ...activatorProps, loading } }">
				<v-btn
					size="small"
					icon="mdi-dots-vertical"
					elevation="0"
					:="activatorProps"
					:loading
				></v-btn>
			</slot>
		</template>
		<template #default>
			<v-list>
				<v-list-item 
					link 
					rounded 
					title="Edit" 
					:disabled="loading"
					@click="emit('edit', sensor)"
				></v-list-item>
				<v-list-item 
					link 
					rounded 
					title="Delete" 
					:disabled="loading"
					@click="onDelete"
				></v-list-item>
				<v-list-item
					link
					rounded
					:title="sensor.disabled ? 'Enable' : 'Disable'"
					:disabled="loading"
					@click="onToggle"
				></v-list-item>
			</v-list>
		</template>
	</v-menu>
</template>

<script setup lang="ts">
import type { Sensor } from "~~/shared/schema/sensor"

//

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], edit: [sensor: Sensor], delete: [id: number], toggle: [sensor: Sensor] }>()
const props = defineProps<{ gid: number, mid: number, sensor: Sensor }>()

// --- State
const loading = ref(false)

// --- Store
const { updateSensor, deleteSensor } = useSensorStore()

// --- Handle
const onDelete = async () => {
	loading.value = true

	const { error, success } = await deleteSensor(props.gid, props.mid, props.sensor.id)
	loading.value = false
	
	if (success) emit("delete", props.sensor.id)
	else emit("error", error)
}

const onToggle = async () => {
	loading.value = true
	const sensor = { ...props.sensor, disabled: !props.sensor.disabled }

	const { data, error, success } = await updateSensor(props.gid, props.mid, sensor)
	loading.value = false
	
	if (success) emit("toggle", data)
	else emit("error", error)
}

//
</script>

<style scoped></style>
