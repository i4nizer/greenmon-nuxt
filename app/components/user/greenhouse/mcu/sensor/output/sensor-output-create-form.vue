<template>
	<VeeForm
		class="bg-green-darken-4 pa-7"
		:initial-values="{ icon: 'mdi-thermometer' }"
		:validation-schema
		#="{ meta }"
		@submit="onSubmit"
	>
		<h3>Create Output</h3>
		<span class="text-grey">Please provide the output details.</span>
		<v-alert 
			v-if="error" 
			type="error" 
			class="my-2" 
			:title="error"
		></v-alert>
		<VeeField name="icon" #="{ field, errorMessage }">
			<v-select
				label="Icon"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="sensorOutputIcons"
				:item-title="(v) => v.substring(4)"
				:item-value="(v) => v"
				:error-messages="errorMessage ? [errorMessage] : []"
				:prepend-inner-icon="field.value"
			>
				<template #item="{ props: iconProps, item }">
					<v-list-item :="iconProps" :prepend-icon="item.raw"></v-list-item>
				</template>
			</v-select>
		</VeeField>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="unit" #="{ field, errorMessage }">
			<v-text-field
				label="Unit"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="pinId" #="{ field, errorMessage }">
			<v-select
				label="Pin"
				v-model="field.value"
				:="field"
				:items="pins"
				:item-value="(p) => p?.id"
				:item-title="(p) => `${p?.number} - ${p?.type}`"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
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
import { OutputCreateSchema, type Output, type OutputCreate } from "~~/shared/schema/output"
import type { Pin } from "~~/shared/schema/pin";

//

// --- Validation
const validationSchema = toTypedSchema(OutputCreateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: OutputCreate], success: [result: Output] }>()
const props = defineProps<{ gid: number, mid: number, sid: number, pins: Pin[] }>()

// --- States
const error = ref<string>()
const loading = ref(false)

// --- Store
const { createOutput } = useOutputStore()

// --- Execute
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as OutputCreate)

	const { gid, mid, sid } = props
	const { data, error: err, success } = await createOutput(gid, mid, sid, values)
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
