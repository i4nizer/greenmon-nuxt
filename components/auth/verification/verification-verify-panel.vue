<template>
    <div>
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
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>