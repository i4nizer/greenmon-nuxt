<template>
	<VeeForm 
		class="bg-green-darken-4 pa-7" 
		:initial-values="greenhouse" 
		:validation-schema 
		#="{ meta }" 
		@submit="onSubmit"
	>
		<h3>Update Greenhouse</h3>
		<span class="text-grey">Please provide the greenhouse details.</span>
		<v-alert 
			v-if="error" 
			type="error" 
			class="my-2" 
			:title="error"
		></v-alert>
		<VeeField name="id" #="{ field }">
			<input type="hidden" :="field" :value="field.value" />
		</VeeField>
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
		<VeeField name="description" #="{ field, errorMessage }">
			<v-textarea
				label="Description"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-textarea>
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
import { GreenhouseUpdateSchema, type Greenhouse, type GreenhouseUpdate } from "~~/shared/schema/greenhouse"

//

// --- Validation
const validationSchema = toTypedSchema(GreenhouseUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: GreenhouseUpdate], success: [result: Greenhouse] }>()
const props = defineProps<{ greenhouse: GreenhouseUpdate }>()

// --- State
const error = ref<string>()
const loading = ref(false)

// --- Store
const { updateGreenhouse } = useGreenhouseStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as GreenhouseUpdate)

	const { data, error: err, success } = await updateGreenhouse(values)
	error.value = err

	loading.value = false
	if (success) {
		event?.resetForm({ values: props.greenhouse })
		emit("success", data)
	}
	else emit("error", err)
}

//
</script>

<style scoped></style>
