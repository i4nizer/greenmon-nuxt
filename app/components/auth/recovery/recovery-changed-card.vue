<template>
    <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
        <v-card-text>
            <div class="d-flex flex-column align-center ga-3">
                <v-icon size="xxx-large" class="text-green">mdi-check-circle</v-icon>
                <h2 class="text-green">Password Updated Successfully!</h2>
                <span class="text-wrap text-grey-darken-3 text-center">
                    Your Greenmon account is now secured with your new password. 
                    All your ESP32 devices and automation settings remain intact.
                </span>
                <div class="bg-grey-lighten-4 rounded w-100 py-4 px-5">
                    <span class="text-grey-darken-1">Redirecting to sign in page in:</span>
                    <br><span class="text-grey-darken-3 text-h4 font-weight-bold">{{ counter }}</span>
                    <br><span class="text-grey-darken-1">seconds</span>
                </div>
                <span class="text-wrap text-grey-darken-3 text-center">
                    Sign in with your new password to access your greenhouse monitoring dashboard.
                </span>
                <v-btn
                    to="/auth/sign-in"
                    text="Sign In Now"
                    class="mt-4 w-100 border bg-green"
                    elevation="0"
                    append-icon="mdi-arrow-right"
                ></v-btn>
                <NuxtLink class="text-grey" to="/">Go to Home Page</NuxtLink>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{ "counter-end": [] }>()

// --- Counter
const counter = ref(5)
const counterInterval = ref(null as NodeJS.Timeout | null)

const counterCallback = () => (counter.value += counter.value > 0 ? -1 : 0)

onMounted(() => counterInterval.value = setInterval(counterCallback, 1000))
onBeforeUnmount(() => counterInterval.value && clearInterval(counterInterval.value))

// --- Pass Invoke
watch(counter, (nv, ov) => ((nv != ov) && nv == 0) && emit("counter-end"))

//

</script>

<style scoped>

</style>