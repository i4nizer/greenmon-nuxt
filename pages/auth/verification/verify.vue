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
                <h1 class="mt-4 my-0">Activating your greenhouse account...</h1>
                <span>
                    We're securely verifying your Greenmon account to ensure safe access to your ESP32 devices and sensor data.
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
                    <v-list-item class="px-1" prepend-icon="mdi-check">Secure account verification process.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">ESP32 device connection preparation.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Real-time sensor data access setup.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Automation rule configuration ready.</v-list-item>
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
                            <v-icon size="xxx-large" class="text-green">mdi-progress-clock</v-icon>
                            <h2 class="text-green">Verifying Your Account...</h2>
                            <span class="text-wrap text-grey-darken-3 text-center">
                                Please wait while we verify your Greenmon account. 
                                This ensures secure access to your ESP32 devices and greenhouse data.
                            </span>
                            <v-progress-linear
                                color="green"
                                height="6"
                                indeterminate
                                rounded
                            ></v-progress-linear>
                            <div class="text-grey-darken-1 d-flex align-center ga-2">
                                <v-icon>mdi-email</v-icon>
                                <span>Secure verification in progress.</span>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Email & Token: Requires Email and Token Query
const route = useRoute()
const { email, token } = route.query
if (!email || !token) await navigateTo("/auth/sign-up")

// --- Verification
onNuxtReady(() =>
    $fetch("/api/auth/verification/verify", { method: "POST", body: { token: token as string } })
        .then(res => navigateTo(`/auth/verification/success?email=${email}`) as void)
        .catch(err => navigateTo(`/auth/verification/failed?reason=${err.statusMessage}`) as void)
)

//

</script>

<style scoped>

</style>