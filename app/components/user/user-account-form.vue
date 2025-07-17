<template>
	<VeeForm :initial-values="props.user" :validation-schema="validationSchema" #="{ meta }" @submit="save">
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
		<VeeField name="email" #="{ field, errorMessage }">
			<v-text-field
				readonly
				label="Email"
				placeholder="example@email.com"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="phone" #="{ field, errorMessage }">
			<v-text-field
				label="Phone"
				placeholder="09105341892"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<v-btn
			type="submit"
			text="Save"
			color="green"
			class="w-100 mt-3"
			:loading="loading"
			:disabled="!meta.valid || !meta.dirty"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import { UserAccountSchema, type UserAccount } from "~~/shared/schema/user"

//

// --- Types & Validation
const validationSchema = toTypedSchema(UserAccountSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [user: UserAccount] }>()
const props = defineProps<{ user?: UserAccount; error?: string; loading?: boolean }>()

// --- Pass Invoke
const save = (values: any) => emit("submit", values as UserAccount)

//
</script>

<style scoped></style>
