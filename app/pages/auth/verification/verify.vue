<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
                    <VerificationVerifyPanel />
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex align-center justify-center h-md-screen">
                    <VerificationVerifyCard />
                </div>
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
    $fetch("/api/auth/verification/verify", { method: "POST", body: { email: email as string, token: token as string } })
        .then(async (res) => await navigateTo(`/auth/verification/success?email=${email}`))
        .catch(async (err) => await navigateTo(`/auth/verification/failed?email=${email}&reason=${err.statusMessage}`))
)

//

</script>

<style scoped>

</style>