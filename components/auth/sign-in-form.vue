<template>
    <VeeForm
        class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :validation-schema="validationSchema"
        :initial-values="{ email: model.email }"
        #="{ meta }"
        @submit="signIn"
    >
        <h2 class="text-green">Sign in to your account</h2>
        <span class="text-grey">Enter your credentials to access your IoT Dashboard</span>
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
        <VeeField name="password" #="{ field, errorMessage }">
            <v-text-field
                label="Password"
                aria-autocomplete="both"
                v-model="model.password"
                :="field"
                :type="showPassword ? 'text' : 'password'"
                :error-messages="errorMessage ? [errorMessage] : []"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
            ></v-text-field>
        </VeeField>
        <v-btn 
            type="submit" 
            text="Sign In" 
            color="green"
            class="w-100 mt-3" 
            :disabled="!meta.valid"
            :loading="props.loading"
        ></v-btn>
        <div class="text-center mt-3">
            <span>Don't have an account? </span>
            <NuxtLink to="/auth/sign-up" class="text-grey">Sign Up</NuxtLink>
            <br>
            <NuxtLink to="/auth/recovery/forgot" class="text-grey">Forgot your password?</NuxtLink>
        </div>
    </VeeForm>
</template>

<script setup lang="ts">
import type { z } from 'zod';
import { UserSchema } from '~/shared/schema/user';

//

// --- Types & Validation
const SignInUserSchema = UserSchema.pick({ email: true, password: true })
const validationSchema = toTypedSchema(SignInUserSchema)
type SignInUser = z.infer<typeof SignInUserSchema>

// --- Data Binding
const emit = defineEmits<{ submit: [user: SignInUser] }>()
const model = defineModel<SignInUser>({ required: true })
const props = defineProps<{ error?: string, loading?: boolean }>()

// --- View Password State
const showPassword = ref(false)

// --- Pass Invoke
const signIn = (values: any) => emit("submit", values as SignInUser)

//

</script>

<style scoped>

</style>