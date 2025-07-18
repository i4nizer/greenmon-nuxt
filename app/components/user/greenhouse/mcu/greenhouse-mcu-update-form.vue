<template>
	<VeeForm 
		class="bg-green-darken-4 pa-7" 
		:initial-values="mcu" 
		:validation-schema 
		#="{ meta }" 
		@submit="onSubmit"
	>
		<h3>Update Mcu</h3>
		<span class="text-grey">Please provide the mcu details.</span>
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
			text="Update"
			color="green"
			class="w-100 mt-3"
			:loading
			:disabled="!meta.valid || !meta.dirty"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { McuUpdateSchema, type Mcu, type McuUpdate } from "~~/shared/schema/mcu"

//

// --- Validation
const validationSchema = toTypedSchema(McuUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [mcu: McuUpdate], success: [result: Mcu] }>()
const props = defineProps<{ gid: number, mcu: McuUpdate }>()

// --- State
const error = ref<string>()
const loading = ref<boolean>(false)

// --- Store
const { updateMcu } = useMcuStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as McuUpdate)

	const { data, error: err, success } = await updateMcu(props.gid, values)
	error.value = err

	if (success) {
		event?.resetForm({ values: props.mcu })
		emit("success", data)
	}
	else emit("error", err)
}

//
</script>

<style scoped></style>
