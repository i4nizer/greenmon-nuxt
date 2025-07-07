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
                <h1 class="mt-4 my-0">Start Your Smart<br/>Greenhouse Journey</h1>
                <span>
                    Join thousands of growers using Greenmon to automate their greenhouse 
                    operations with ESP32-powered IoT sensors and real-time control.
                </span>
                <div class="d-flex align-center justify-center w-100 py-16">
                    <NuxtImg
                        src="/images/art-greenhouse.png"
                        sizes="xs:50dvw md:20dvw"
                        format="webp"
                        densities="x1"
                    />
                </div>
                <span class="text-h6 font-weight-bold">Smart Greenhouse Features</span>
                <v-list class="bg-transparent">
                    <v-list-item class="px-1" prepend-icon="mdi-check">Real-time WebSocket dashboard with live sensor data.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Monitor temperature, humidity, pH, and water levels.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Control irrigation pumps and exhaust fans remotely.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">View automation logs and threshold alerts.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Manage schedules and custom automation rules.</v-list-item>
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
                    @submit="signIn"
                >
                    <h2 class="text-green">Create an account</h2>
                    <span class="text-grey">Sign up for your IoT Dashboard account</span>
                    <v-alert
                        v-if="signUpError"
                        type="error"
                        class="my-2"
                        :title="signUpError"
                    ></v-alert>
                    <VeeField name="name" #="{ field, errorMessage }">
                        <v-text-field
                            label="Name"
                            class="mt-6"
                            aria-autocomplete="both"
                            :="field"
                            :error-messages="errorMessage ? [errorMessage] : []"
                        ></v-text-field>
                    </VeeField>
                    <VeeField name="email" #="{ field, errorMessage }">
                        <v-text-field
                            label="Email"
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
                        text="Sign Up"
                        type="submit"
                        color="green"
                        class="w-100 mt-3"
                        :disabled="!meta.valid"
                        :loading="isSubmitting"
                    ></v-btn>
                    <div class="text-center mt-3">
                        <span>Already have an account? </span>
                        <NuxtLink class="text-grey" to="/auth/sign-in">Sign In</NuxtLink>
                    </div>
                </VeeForm>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { z } from "zod";
import { UserSchema } from '~/shared/schema/user';
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Types & Validation
const SignUpUserSchema = UserSchema.pick({ name: true, email: true, password: true })
const validationSchema = toTypedSchema(SignUpUserSchema)
type SignUpUser = z.infer<typeof SignUpUserSchema>

// --- Fetch Error Display
const signUpError = ref(undefined as string | undefined)

// --- View Password State
const revealPassword = ref(false)

// --- Sign In Logic
const signIn = async (values: any) => {
    signUpError.value = undefined
    const user = values as SignUpUser
    await $fetch("/api/auth/sign-up", { method: "POST", body: user })
        .then(() => navigateTo(`/auth/verification/sent?email=${user.email}`) as void)
        .catch(err => signUpError.value = err?.statusMessage)
}

//

</script>

<style lang="css" scoped></style>
