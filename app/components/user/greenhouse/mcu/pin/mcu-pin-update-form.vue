<template>
	<VeeForm class="bg-green-darken-4 pa-7" :initial-values="pin" :validation-schema #="{ meta }" @submit="update">
		<h3>Update Pin</h3>
		<span class="text-grey">Please provide the pin details.</span>
		<v-alert v-if="error" type="error" class="my-2" :title="error"></v-alert>
		<VeeField name="id" #="{ field }">
			<input type="hidden" v-model="field.value" />
		</VeeField>
		<VeeField name="type" #="{ field, errorMessage }">
			<v-select
				label="Type"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="['Digital', 'Analog']"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="mode" #="{ field, errorMessage }">
			<v-select
				label="Mode"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="['Unset', 'Input', 'Output', 'Other']"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="number" #="{ field, errorMessage }">
			<v-number-input
				label="Number"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
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
import { PinUpdateSchema, type PinUpdate } from "~~/shared/schema/pin"

//

// --- Validation
const validationSchema = toTypedSchema(PinUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [pin: PinUpdate] }>()
const props = defineProps<{ pin: PinUpdate; error?: string; loading?: boolean }>()

// --- Pass Invoke
const update = (values: any) => emit("submit", values as PinUpdate)

//
</script>

<style scoped></style>
