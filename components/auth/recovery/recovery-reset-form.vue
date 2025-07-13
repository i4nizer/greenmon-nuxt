<template>
    <VeeForm
        class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="{ token: props.token }"
        :validation-schema="validationSchema"
        #="{ meta }"
        @submit="resetPassword"
    >
        <h2 class="text-green">Create New Password</h2>
        <span class="text-grey">Enter a strong password to secure your Greenmon account.</span>
        <v-alert
            v-if="props.error"
            type="error"
            class="my-2"
            :title="props.error"
        ></v-alert>
        <VeeField name="password" #="{ field, errorMessage }">
            <v-text-field
                label="New Password"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :type="revealPassword ? 'text' : 'password'"
                :error-messages="errorMessage ? [errorMessage] : []"
                :append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="revealPassword = !revealPassword"
            ></v-text-field>
        </VeeField>
        <VeeField name="confirm" #="{ field, errorMessage }">
            <v-text-field
                label="Confirm Password"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :type="revealPassword ? 'text' : 'password'"
                :error-messages="errorMessage ? [errorMessage] : []"
                :append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="revealPassword = !revealPassword"
            ></v-text-field>
        </VeeField>
        <VeeField name="token" #="{ field }">
            <input type="hidden" :value="props.token" :="field">
        </VeeField>
        <v-btn 
            type="submit" 
            text="Reset Password"
            color="green"
            class="w-100 mt-3" 
            :disabled="!meta.valid"
            :loading="props.loading"
        ></v-btn>
        <div class="text-center mt-3">
            <NuxtLink to="/auth/sign-in" class="text-grey">Back to Sign In</NuxtLink>
        </div>
    </VeeForm>
</template>

<script setup lang="ts">
import { UserPasswordResetSchema, type UserPasswordReset } from '~/shared/schema/user';

//

// --- Validation
const validationSchema = toTypedSchema(UserPasswordResetSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [data: UserPasswordReset] }>()
const props = defineProps<{ token: string, error?: string, loading?: boolean }>()

// --- Password View State
const revealPassword = ref(false)

// --- Pass Invoke
const resetPassword = (values: any) => emit("submit", values as UserPasswordReset)

//

</script>

<style scoped>

</style>