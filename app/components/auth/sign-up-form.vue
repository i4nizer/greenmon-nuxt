<template>
	<VeeForm class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75" :validation-schema="validationSchema" #="{ meta }" @submit="signUp">
		<h2 class="text-green">Create an account</h2>
		<span class="text-grey">Sign up for your IoT Dashboard account</span>
		<v-alert v-if="props.error" type="error" class="my-2" :title="props.error"></v-alert>
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
				label="Email"
				placeholder="example@email.com"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="password" #="{ field, errorMessage }">
			<v-text-field
				label="Password"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:type="revealPassword ? 'text' : 'password'"
				:error-messages="errorMessage ? [errorMessage] : []"
				:append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="revealPassword = !revealPassword"
			></v-text-field>
		</VeeField>
		<v-btn
			text="Sign Up"
			type="submit"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="props.loading"
		></v-btn>
		<div class="text-center mt-3">
			<span>Already have an account? </span>
			<NuxtLink class="text-grey" to="/auth/sign-in">Sign In</NuxtLink>
		</div>
	</VeeForm>
</template>

<script setup lang="ts">
import { UserSignUpSchema, type UserSignUp } from "~~/shared/schema/user"
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Validation
const validationSchema = toTypedSchema(UserSignUpSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [user: UserSignUp] }>()
const props = defineProps<{ error?: string; loading?: boolean }>()

// --- View Password State
const revealPassword = ref(false)

// --- Pass Invoke
const signUp = (values: any) => emit("submit", values as UserSignUp)

//
</script>

<style scoped></style>
