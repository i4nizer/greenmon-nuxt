<template>
	<VeeForm 
		class="bg-green-darken-4 pa-7 rounded" 
		:initial-values="sensor" 
		:validation-schema 
		#="{ meta }" 
		@submit="onSubmit"
	>
		<h3>Update Sensor</h3>
		<span class="text-grey">Please provide the sensor details.</span>
		<v-alert 
			v-if="error" 
			type="error" 
			class="my-2" 
			:title="error"
		></v-alert>
		<VeeField name="id" #="{ field }">
			<input type="hidden" v-model="field.value" />
		</VeeField>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				:="field"
				:model-value="field.value"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="label" #="{ field, errorMessage }">
			<v-text-field
				label="Label"
				aria-autocomplete="both"
				:="field"
				:model-value="field.value"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="interval" #="{ field, errorMessage }">
			<v-number-input
				type="number"
				label="Read Interval"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="disabled" #="{ field, errorMessage }">
			<v-select
				label="Flag"
				aria-autocomplete="both"
				:="field"
				:items="['Disabled', 'Enabled']"
				:item-title="(v) => v"
				:item-value="(v) => v == 'Disabled'"
				:model-value="field.value"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<v-btn
			type="submit"
			text="Update"
			color="green"
			class="w-100 mt-3"
			:loading
			:disabled="!meta.valid || !meta.dirty"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { SensorUpdateSchema, type Sensor, type SensorUpdate } from "~~/shared/schema/sensor"

//

// --- Validation
const validationSchema = toTypedSchema(SensorUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: SensorUpdate], success: [result: Sensor] }>()
const props = defineProps<{ gid: number, mid: number, sensor: SensorUpdate }>()

// --- State
const error = ref<string>()
const loading = ref(false)

// --- Store
const { updateSensor } = useSensorStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as SensorUpdate)

	const { data, error: err, success } = await updateSensor(props.gid, props.mid, props.sensor)
	error.value = err
	loading.value = false

	if (success) {
		event?.resetForm({ values: props.sensor })
		emit("success", data)
	}
	else emit("error", err)
}

//
</script>

<style scoped></style>
