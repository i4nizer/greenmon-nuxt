<template>
	<VeeForm
		class="bg-green-darken-4 pa-7"
		:initial-values="{ icon: 'mdi-thermometer' }"
		:validation-schema
		#="{ meta }"
		@submit="create"
	>
		<h3>Create Output</h3>
		<span class="text-grey">Please provide the output details.</span>
		<v-alert v-if="error" type="error" class="my-2" :title="error"></v-alert>
		<VeeField name="pinId" #="{ field }">
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
				:prepend-icon="field.value"
				:error-messages="errorMessage ? [errorMessage] : []"
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
import { OutputCreateSchema, type OutputCreate } from "~~/shared/schema/output"

//

// --- Validation
const validationSchema = toTypedSchema(OutputCreateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [output: OutputCreate] }>()
const props = defineProps<{ error?: string; loading?: boolean }>()

// --- Pass Invoke
const create = (values: any) => emit("submit", values as OutputCreate)

//
</script>

<style scoped></style>
