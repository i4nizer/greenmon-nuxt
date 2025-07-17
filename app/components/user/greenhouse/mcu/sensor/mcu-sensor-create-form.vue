<template>
	<VeeForm
		class="bg-green-darken-4 pa-7"
		:initial-values="{ type: 'Digital', mode: 'Unset', number: -1 }"
		:validation-schema
		#="{ meta }"
		@submit="create"
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
import { SensorCreateSchema, type SensorCreate } from "~~/shared/schema/sensor"

//

// --- Validation
const validationSchema = toTypedSchema(SensorCreateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [sensor: SensorCreate] }>()
const props = defineProps<{ error?: string; loading?: boolean }>()

// --- Pass Invoke
const create = (values: any) => emit("submit", values as SensorCreate)

//
</script>

<style scoped></style>
