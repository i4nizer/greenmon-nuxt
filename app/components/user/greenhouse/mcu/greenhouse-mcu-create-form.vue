<template>
	<VeeForm 
		class="bg-green-darken-4 pa-7" 
		:validation-schema 
		#="{ meta }" 
		@submit="onSubmit"
	>
		<h3>Create Mcu</h3>
		<span class="text-grey">Please provide the mcu details.</span>
		<v-alert 
			v-if="error" 
			type="error" 
			class="my-2" 
			:title="error"
		></v-alert>
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
			<v-textarea
				label="Label"
				aria-autocomplete="both"
				v-model="field.value"
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
import { McuCreateSchema, type Mcu, type McuCreate } from "~~/shared/schema/mcu"

//

// --- Validation
const validationSchema = toTypedSchema(McuCreateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: McuCreate], success: [result: Mcu] }>()
const props = defineProps<{ gid: number }>()

// --- State
const error = ref<string>()
const loading = ref<boolean>(false)

// --- Store
const { createMcu } = useMcuStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as McuCreate)

	const { data, error: err, success } = await createMcu(props.gid, values)
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
