<template>
	<VeeForm
		class="bg-green-darken-4 pa-7"
		:initial-values="props.output"
		:validation-schema
		#="{ meta }"
		@submit="onSubmit"
	>
		<h3>Update Output</h3>
		<span class="text-grey">Please provide the output details.</span>
		<v-alert v-if="error" type="error" class="my-2" :title="error"></v-alert>
		<VeeField name="id" #="{ field }">
			<input type="hidden" v-model="field.value" />
		</VeeField>
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
			text="Update"
			color="green"
			class="w-100 mt-3"
			:loading
			:disabled="!meta.valid || !meta.dirty"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { OutputUpdateSchema, type Output, type OutputUpdate } from "~~/shared/schema/output"
import type { Pin } from "~~/shared/schema/pin";

//

// --- Validation
const validationSchema = toTypedSchema(OutputUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string]; submit: [data: OutputUpdate]; success: [result: Output] }>()
const props = defineProps<{ gid: number; mid: number; sid: number; output: OutputUpdate; pins: Pin[] }>()

// --- State
const error = ref<string>()
const loading = ref(false)

// --- Store
const { updateOutput } = useOutputStore()

// --- Handle
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = false
	emit("submit", values as OutputUpdate)

	const { gid, mid, sid } = props
	const { data, error: err, success } = await updateOutput(gid, mid, sid, values)
	error.value = err

	if (success) {
		event?.resetForm({ values: props.output })
		emit("success", data)
	}
	else emit("error", err)
}

//
</script>

<style scoped></style>
