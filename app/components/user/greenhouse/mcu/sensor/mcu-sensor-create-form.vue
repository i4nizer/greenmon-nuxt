<template>
	<VeeForm
		class="bg-green-darken-4 pa-7"
		:initial-values="{ type: 'Digital', mode: 'Unset', number: -1 }"
		:validation-schema
		#="{ meta }"
		@submit="onSubmit"
	>
		<h3>Create Sensor</h3>
		<span class="text-grey">Please provide the sensor details.</span>
		<v-alert v-if="error" type="error" class="my-2" :title="error"></v-alert>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="label" #="{ field, errorMessage }">
			<v-text-field
				label="Label"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="interval" #="{ field, errorMessage }">
			<v-number-input
				type="number"
				label="Interval"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<v-btn
			type="submit"
			text="Create"
			color="green"
			class="w-100 mt-3"
			:loading
			:disabled="!meta.valid || !meta.dirty"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { SensorCreateSchema, type Sensor, type SensorCreate } from "~~/shared/schema/sensor"

//

// --- Validation
const validationSchema = toTypedSchema(SensorCreateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: SensorCreate], success: [result: Sensor] }>()
const props = defineProps<{ gid: number, mid: number }>()

// --- State
const error = ref<string>()
const loading = ref(false)

// --- Store
const { createSensor } = useSensorStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as SensorCreate)

	const { data, error: err, success } = await createSensor(props.gid, props.mid, values)
	error.value = err
	loading.value = false

	if (success) {
		event?.resetForm()
		emit("success", data)
	}
	else emit("error", err)
}

//
</script>

<style scoped></style>