<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col 
                cols="12" md="6"
                class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12"
            >
                <NuxtLink 
                    to="/" 
                    class="text-white text-decoration-none d-flex align-center ga-2"
                >
                    <v-icon>mdi-sprout</v-icon>
                    <h2>Greenmon</h2>
                </NuxtLink>
                <h1 class="mt-4 my-0">Regain Access to Your Greenhouse</h1>
                <span>
                    Don't worry! Enter your email address and we'll send you a secure link to 
                    reset your password and get back to monitoring your plants.
                </span>
                <div class="d-flex align-center justify-center w-100 py-16">
                    <NuxtImg
                        src="/images/art-plant-ec.png"
                        sizes="xs:50dvw md:20dvw"
                        format="webp"
                        densities="x1"
                    />
                </div>
                <span class="text-h6 font-weight-bold">Smart Greenhouse Features</span>
                <v-list class="bg-transparent">
                    <v-list-item class="px-1" prepend-icon="mdi-check">Quick and secure password recovery.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Maintain ESP32 device connections.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Preserve all automation settings.</v-list-item>
                </v-list>
                <div class="d-flex ga-2 mt-2">
                    <div class="bg-green-darken-1 rounded text-center pa-4 pt-3 w-50">
                        <span class="font-weight-bold text-h6">24/7</span>
                        <br><span>Monitoring</span>
                    </div>
                    <div class="bg-green-darken-1 rounded text-center pa-4 pt-3 w-50">
                        <span class="font-weight-bold text-h6">ESP32</span>
                        <br><span>WebSocket</span>
                    </div>
                </div>
            </v-col>
            <v-col 
                cols="12" md="6"
                class="d-flex align-center justify-center h-md-screen"
            >
            <VeeForm
                class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
                :validation-schema="validationSchema"
                :initial-values="{ email: $route.query?.email }"
                #="{ meta, isSubmitting }"
                @submit="forgotPassword"
            >
                <h2 class="text-green">Forgot Password?</h2>
                <span class="text-grey">Enter your email address and we'll send you a link to reset your password</span>
                <v-alert
                    v-if="forgotPasswordError"
                    type="error"
                    class="my-2"
                    :title="forgotPasswordError"
                ></v-alert>
                <VeeField name="email" #="{ field, errorMessage }">
                    <v-text-field
                        label="Email"
                        class="mt-6"
                        placeholder="example@email.com"
                        aria-autocomplete="both"
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
                    :loading="isSubmitting"
                ></v-btn>
                <div class="text-center mt-3">
                    <NuxtLink to="/auth/sign-in" class="text-grey">Back to Sign In</NuxtLink>
                </div>
            </VeeForm>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { z } from 'zod';

//

// --- Types & Validation
const EmailSchema = z.object({ email: z.string().email() })
const validationSchema = toTypedSchema(EmailSchema)
type EmailObject = z.infer<typeof EmailSchema>

// --- Display Error
const forgotPasswordError = ref(undefined as string | undefined)

//
const forgotPassword = async (values: any) => {
    forgotPasswordError.value = undefined
    const emailObj = values as EmailObject
    await $fetch("/api/auth/password/forgot", { method: "POST", body: emailObj })
        .then(() => navigateTo(`/auth/password/sent?email=${emailObj.email}`) as void)
        .catch(err => forgotPasswordError.value = err?.statusMessage)
}

//

</script>

<style lang="css" scoped></style>
