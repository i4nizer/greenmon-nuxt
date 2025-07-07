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
                <h1 class="mt-4 my-0">Verification Support!</h1>
                <span>
                    Don't worry! We're here to help you get your Greenmon account verified 
                    so you can start automating your greenhouse with ESP32 devices.
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
                    <v-list-item class="px-1" prepend-icon="mdi-check">Quick verification issue resolution.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Multiple verification attempts allowed.</v-list-item>
                    <v-list-item class="px-1" prepend-icon="mdi-check">Secure link regeneration.</v-list-item>
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
                            <v-icon size="xxx-large" class="text-red">mdi-close-circle</v-icon>
                            <h2 class="text-red">Verification Failed</h2>
                            <span class="text-wrap text-grey-darken-3 text-center">
                                {{ $route.query.reason ?? `We couldn't verify your Greenmon account. 
                                This could be due to an expired or invalid verification link.` }}
                            </span>
                            <div class="bg-grey-lighten-4 rounded w-100 py-4 px-5">
                                <span class="text-grey-darken-1">Redirecting to verification page in:</span>
                                <br><span class="text-grey-darken-3 text-h4 font-weight-bold">5</span>
                                <br><span class="text-grey-darken-1">seconds</span>
                            </div>
                            <div class="align-self-start">
                                <span>Common reasons for verification failure:</span>
                                <ul class="pl-5 mt-2 text-grey-darken-3">
                                    <li>The verification link has expired.</li>
                                    <li>The link has already been used.</li>
                                    <li>The link was corrupted or incomplete.</li>
                                    <li>Your email address was not found.</li>
                                </ul>
                            </div>
                            <v-btn
                                text="Go to Verification Page"
                                class="mt-4 w-100 border"
                                elevation="0"
                                prepend-icon="mdi-restore"
                            ></v-btn>
                            <NuxtLink class="text-grey" to="/auth/sign-up">Try with a different email</NuxtLink>
                            <NuxtLink class="text-grey" to="/auth/sign-in">Already verified? Sign in to dashboard</NuxtLink>
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

// --- Counter
const counter = ref(5)
const counterInterval = ref(null as NodeJS.Timeout | null)

const counterCallback = () => (counter.value += counter.value > 0 ? -1 : 0)

onMounted(() => import.meta.client && (counterInterval.value = setInterval(counterCallback, 1000)))
onBeforeUnmount(() => import.meta.client && counterInterval.value && clearInterval(counterInterval.value))

// --- Redirect
watch(counter, nv => nv == 0 ? navigateTo(`/auth/verification/sent?email=${email}`) : null)

//

</script>

<style scoped>

</style>