<template>
    <VeeForm
        class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :validation-schema="validationSchema"
        :initial-values="{ email: $route.query?.email }"
        #="{ meta }"
        @submit="forgotPassword"
    >
        <h2 class="text-green">Forgot Password?</h2>
        <span class="text-grey">Enter your email address and we'll send you a link to reset your password</span>
        <v-alert
            v-if="props.error"
            type="error"
            class="my-2"
            :title="props.error"
        ></v-alert>
        <VeeField name="email" #="{ field, errorMessage }">
            <v-text-field
                label="Email"
                class="mt-6"
                placeholder="example@email.com"
                aria-autocomplete="both"
                v-model="model.email"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-text-field>
        </VeeField>
        <v-btn 
            type="submit" 
            text="Send Reset Link"
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
import { z } from 'zod';

//

// --- Types & Validation
const EmailSchema = z.object({ email: z.string().email() })
const validationSchema = toTypedSchema(EmailSchema)
type EmailObject = z.infer<typeof EmailSchema>

// --- Data Binding
const emit = defineEmits<{ submit: [email: EmailObject] }>()
const model = defineModel<EmailObject>({ required: true })
const props = defineProps<{ error?: string, loading?: boolean }>()

//
const forgotPassword = async (values: any) => emit("submit", values as EmailObject)

//

</script>

<style scoped>

</style>