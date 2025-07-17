<template>
	<VeeForm class="bg-green-darken-4 pa-7" :validation-schema #="{ meta }" @submit="create">
		<h3>Create Greenhouse</h3>
		<span class="text-grey">Please provide the greenhouse details.</span>
		<v-alert v-if="error" type="error" class="my-2" :title="error"></v-alert>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="description" #="{ field, errorMessage }">
			<v-textarea
				label="Description"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-textarea>
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
import { GreenhouseCreateSchema, type GreenhouseCreate } from "~~/shared/schema/greenhouse"

//

// --- Validation
const validationSchema = toTypedSchema(GreenhouseCreateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [greenhouse: GreenhouseCreate] }>()
const props = defineProps<{ error?: string; loading?: boolean }>()

// --- Pass Invoke
const create = (values: any) => emit("submit", values as GreenhouseCreate)

//
</script>

<style scoped></style>
