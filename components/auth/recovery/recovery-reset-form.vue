<template>
    <VeeForm
        class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
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
                v-model="model.password"
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
                v-model="model.confirm"
                :="field"
                :type="revealPassword ? 'text' : 'password'"
                :error-messages="errorMessage ? [errorMessage] : []"
                :append-inner-icon="revealPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="revealPassword = !revealPassword"
            ></v-text-field>
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
import z from 'zod'

//

// --- Types & Validation
const PasswordSchema = z
    .object({ password: z.string().min(8), confirm: z.string().min(8) })
    .refine((data) => data.confirm === data.password, { message: "Passwords must match.", path: ["confirm"] })
const validationSchema = toTypedSchema(PasswordSchema)
type PasswordObject = z.infer<typeof PasswordSchema>

// --- Data Binding
const emit = defineEmits<{ submit: [data: PasswordObject] }>()
const model = defineModel<PasswordObject>({ required: true })
const props = defineProps<{ error?: string, loading?: boolean }>()

// --- Password View State
const revealPassword = ref(false)

// --- Pass Invoke
const resetPassword = (values: any) => emit("submit", values as PasswordObject)

//

</script>

<style scoped>

</style>