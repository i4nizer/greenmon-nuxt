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
                <h1 class="mt-4 my-0">Activate Your Greenhouse Account</h1>
                <span>
                    We've sent you a verification email to secure your Greenmon account. 
                    Once verified, you can start connecting your ESP32 devices and sensors.
                </span>
                <div class="d-flex align-center justify-center w-100 py-16">
                    <NuxtImg
                        src="/images/art-watering.png"
                        sizes="xs:50dvw md:20dvw"
                        format="webp"
                        densities="x1"
                    />
                </div>
                <span class="text-h6 font-weight-bold">Smart Greenhouse Features</span>
                <v-list class="bg-transparent">
                    <v-list-item class="px-1" prepend-icon="mdi-check">Secure account verification for device safety.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Connect unlimited ESP32 microcontrollers.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Real-time WebSocket communication setup.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Custom automation rule configuration.</v-list-item>
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
                <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
                    <v-card-text>
                        <div class="d-flex flex-column align-center ga-3">
                            <v-icon size="xxx-large" class="text-green">mdi-email</v-icon>
                            <h2 class="text-green">Check Your Email</h2>
                            <v-alert
                                v-if="resendError"
                                type="error"
                                class="my-2"
                                :title="resendError"
                            ></v-alert>
                            <span class="text-wrap text-center text-grey-darken-3">
                                We've sent a verification link to 
                                <span class="font-weight-bold">{{ email }}</span>.
                                to activate your Greenmon account. 
                                Click the link to start monitoring your greenhouse.
                            </span>
                            <span class="text-wrap text-grey-darken-3 my-4">
                                Didn't receive the email? Check your spam folder or
                            </span>
                            <v-btn
                                class="w-100 border"
                                elevation="0"
                                :text="isNaN(counterSec) || counterSec > 0 ? `Resend in ${counterSec.toFixed(0)}s` : 'Resend Verification Email'"
                                :disabled="isNaN(counterSec) || counterSec > 0"
                                @click="resendVerificationEmail"
                            ></v-btn>
                            <NuxtLink 
                                to="/auth/sign-in"
                                class="text-grey-darken-2"
                            >Go to Sign In</NuxtLink>
                            <NuxtLink 
                                to="/auth/sign-up"
                                class="text-grey-darken-2"
                            >Use a different email.</NuxtLink>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Email: Requires Email Query
const route = useRoute()
const { email } = route.query
if (!email) await navigateTo("/auth/sign-up")

// --- Error display
const resendError = ref(undefined as string | undefined)

// --- Resend Counter
const counterMs = ref(0)
const counterSec = ref(0)
const counterInterval = ref(null as NodeJS.Timeout | null)

const counterCallback = () => (counterSec.value = (counterMs.value - Date.now()) / 1000 )

onNuxtReady(() =>
    $fetch("/api/auth/verification/time", { method: "POST", body: { email: email as string } })
        .then(res => counterMs.value = res.time + 60000)
        .catch(() => navigateTo("/auth/sign-up") as void)
)
onBeforeMount(() => counterInterval.value = setInterval(counterCallback, 1000))
onBeforeUnmount(() => counterInterval.value && clearInterval(counterInterval.value))

// --- Resend Logic
const resendVerificationEmail = async () => {
    await $fetch("/api/auth/verification/resend", { method: "POST", body: { email: email as string } })
        .then(res => counterMs.value = res.time + 60000)
        .catch(err => resendError.value = err.statusMessage)
}

//

</script>

<style lang="css" scoped></style>
