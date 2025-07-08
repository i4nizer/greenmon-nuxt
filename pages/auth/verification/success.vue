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
                <h1 class="mt-4 my-0">Welcome to the Greenmon Community!</h1>
                <span>
                    Your account is verified and ready! 
                    Join thousands of growers using smart automation to optimize their greenhouse operations with ESP32 technology.
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
                    <v-list-item class="px-1" prepend-icon="mdi-check">Connect unlimited ESP32 microcontrollers.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Real-time sensor monitoring dashboard.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Custom automation rules and scheduling.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">pH, temperature, and nutrient management.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">WebSocket-powered instant device control.</v-list-item>
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
                            <v-icon size="xxx-large" class="text-green">mdi-check-circle</v-icon>
                            <h2 class="text-green">Verification Success</h2>
                            <span class="text-wrap text-grey-darken-3 text-center">
                                Your Greenmon account is now active! 
                                You can start connecting your ESP32 devices and setting up your greenhouse automation.
                            </span>
                            <div class="bg-grey-lighten-4 rounded w-100 py-4 px-5">
                                <span class="text-grey-darken-1">Redirecting to sign in page in:</span>
                                <br><span class="text-grey-darken-3 text-h4 font-weight-bold">{{ counter }}</span>
                                <br><span class="text-grey-darken-1">seconds</span>
                            </div>
                            <span class="text-wrap text-grey-darken-3 text-center">
                                Sign in to access your dashboard and start configuring your ESP32 sensors and automation rules.
                            </span>
                            <v-btn
                                text="Access Dashboard Now"
                                class="mt-4 w-100 border bg-green"
                                elevation="0"
                                append-icon="mdi-arrow-right"
                            ></v-btn>
                            <NuxtLink class="text-grey" to="/">Go to Home Page</NuxtLink>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Email: Optional Email Query
const route = useRoute()
const { email } = route.query

// --- Counter
const counter = ref(5)
const counterInterval = ref(null as NodeJS.Timeout | null)

const counterCallback = () => (counter.value += counter.value > 0 ? -1 : 0)

onMounted(() => import.meta.client && (counterInterval.value = setInterval(counterCallback, 1000)))
onBeforeUnmount(() => import.meta.client && counterInterval.value && clearInterval(counterInterval.value))

// --- Redirect
watch(counter, nv => nv == 0 ? navigateTo(`/auth/sign-in${email ? `?email=${email}` : ''}`) : null)

//

</script>

<style scoped>

</style>