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
                <h1 class="mt-4 my-0">Secure Your Greenhouse Account</h1>
                <span>
                    Create a strong password to protect your ESP32 devices, sensor data, 
                    and automation configurations from unauthorized access.
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
                    <v-list-item class="px-1" prepend-icon="mdi-check">Protect ESP32 device connections.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Secure sensor data and logs.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Safeguard automation configurations.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Maintain WebSocket security.</v-list-item>
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
                    #="{ meta, isSubmitting }"
                    @submit="resetPassword"
                >
                    <h2 class="text-green">Create New Password</h2>
                    <span class="text-grey">Enter a strong password to secure your Greenmon account.</span>
                    <v-alert
                        v-if="resetPasswordError"
                        type="error"
                        class="my-2"
                        :title="resetPasswordError"
                    ></v-alert>
                    <VeeField name="password" #="{ field, errorMessage }">
                        <v-text-field
                            label="New Password"
                            aria-autocomplete="both"
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

// --- Token: Requires Token Query
const route = useRoute()
const { email, token } = route.query
if (!token) await navigateTo("/auth/password/forgot")

// --- Types & Validation
const PasswordSchema = z
    .object({ password: z.string().min(8), confirm: z.string().min(8) })
    .refine((data) => data.confirm === data.password, { message: "Passwords must match.", path: ["confirm"] })
const validationSchema = toTypedSchema(PasswordSchema)
type PasswordObject = z.infer<typeof PasswordSchema>

// --- Display Error
const resetPasswordError = ref(undefined as string | undefined)

// --- Password View State
const revealPassword = ref(false)

//

const resetPassword = async (values: any) => {
    resetPasswordError.value = undefined
    const passwordObj = { ...(values as PasswordObject), token }
    await $fetch("/api/auth/password/reset", { method: "POST", body: passwordObj })
        .then(() => navigateTo(`/auth/password/changed${email ? `?email=${email}` : ''}`) as void)
        .catch(err => resetPasswordError.value = err?.statusMessage)
}

//

</script>

<style lang="css" scoped></style>
