<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
                    <VerificationFailedPanel />
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex align-center justify-center h-md-screen">
                    <VerificationFailedCard 
                        :email="(email as string)"
                        :reason="(reason as string | undefined)"
                        @counter-end="redirect"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Email: Requires Email Query
const route = useRoute()
const { email, reason } = route.query
if (!email) await navigateTo("/auth/sign-up")

// --- Redirect
const redirect = () => navigateTo(`/auth/verification/sent?email=${email}`)

//

</script>

<style scoped>

</style>