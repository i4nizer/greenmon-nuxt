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
                <h1 class="mt-4 my-0">Welcome Back to Your Greenhouse</h1>
                <span>
                    Sign in to monitor your sensors, check automation status, 
                    and control your ESP32-connected devices in real-time.
                </span>
                <div class="d-flex align-center justify-center w-100 py-16">
                    <NuxtImg
                        src="/images/art-plant-ph.png"
                        sizes="xs:50dvw md:20dvw"
                        format="webp"
                        densities="x1"
                    />
                </div>
                <span class="text-h6 font-weight-bold">Smart Greenhouse Features</span>
                <v-list class="bg-transparent">
                    <v-list-item class="px-1" prepend-icon="mdi-check">ESP32 WebSocket connectivity for real-time control.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">DHT22 temperature monitoring & exhaust fan automation.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Ultrasonic water level sensing & pump scheduling.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">pH sensor regulation with automated dosing pumps.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">TDS monitoring for nutrient solution management.</v-list-item>
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
                @submit="signIn"
            >
                <h2 class="text-green">Sign in to your account</h2>
                <span class="text-grey">Enter your credentials to access your IoT Dashboard</span>
                <v-alert
                    v-if="signInError"
                    type="error"
                    class="my-2"
                    :title="signInError"
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
                <VeeField name="password" #="{ field, errorMessage }">
                    <v-text-field
                        label="Password"
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
                    text="Sign In" 
                    color="green"
                    class="w-100 mt-3" 
                    :disabled="!meta.valid"
                    :loading="isSubmitting"
                ></v-btn>
                <div class="text-center mt-3">
                    <span>Don't have an account? </span>
                    <NuxtLink to="/auth/sign-up" class="text-grey">Sign Up</NuxtLink>
                    <br>
                    <NuxtLink to="/auth/recovery/forgot" class="text-grey">Forgot your password?</NuxtLink>
                </div>
            </VeeForm>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { z } from 'zod';
import { UserSchema } from '~/shared/schema/user';

//

// --- Types & Validation
const SignInUserSchema = UserSchema.pick({ email: true, password: true })
const validationSchema = toTypedSchema(SignInUserSchema)
type SignInUser = z.infer<typeof SignInUserSchema>

// --- Display Error
const signInError = ref(undefined as string | undefined)

// --- View Password State
const revealPassword = ref(false)

//
const signIn = async (values: any) => {
    signInError.value = undefined
    const user = values as SignInUser
    await $fetch("/api/auth/sign-in", { method: "POST", body: user })
        .then(() => navigateTo("/user/greenhouse") as void)
        .catch(err => signInError.value = err?.statusMessage)
}

//

</script>

<style lang="css" scoped></style>
