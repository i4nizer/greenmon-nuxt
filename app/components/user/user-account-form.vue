<template>
	<VeeForm 
		:initial-values="props.user"
		:validation-schema 
		#="{ meta }" 
		@submit="onSubmit"
	>
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
import { UserAccountSchema, type UserAccount, type UserSafe } from "~~/shared/schema/user"

//

// --- Types & Validation
const validationSchema = toTypedSchema(UserAccountSchema)

// --- Data Binding
const emit = defineEmits<{ error: [msg: string], submit: [data: UserAccount], success: [result: UserSafe] }>()
const props = defineProps<{ user?: UserAccount, action?: string }>()

// --- States
const error = ref<string>()
const loading = ref<boolean>(false)

// --- Handle Submission
const onSubmit = async (values: any, event: any) => {
	error.value = undefined
	loading.value = true
	emit("submit", values as UserAccount)

	const url = props.action ?? `/api/user/account`
	await $fetch<UserSafe>(url, { method: "POST", body: values })
		.then(res => emit("success", res))
		.catch(err => (error.value = err?.statusMessage ?? "Something went wrong."))

	if (error.value) emit("error", error.value)
	loading.value = false
	event?.resetForm({ values: props.user })
}

//
</script>

<style scoped></style>
