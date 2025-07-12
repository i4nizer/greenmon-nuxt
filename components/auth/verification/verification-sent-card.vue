<template>
    <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
        <v-card-text>
            <div class="d-flex flex-column align-center ga-3">
                <v-icon size="xxx-large" class="text-green">mdi-email</v-icon>
                <h2 class="text-green">Check Your Email</h2>
                <v-alert
                    v-if="props.error"
                    type="error"
                    class="my-2"
                    :title="props.error"
                ></v-alert>
                <span class="text-wrap text-center text-grey-darken-3">
                    We've sent a verification link to 
                    <span class="font-weight-bold">{{ props.email ?? " your email address" }}</span>.
                    to activate your Greenmon account. 
                    Click the link to start monitoring your greenhouse.
                </span>
                <span class="text-wrap text-grey-darken-3 my-4">
                    Didn't receive the email? Check your spam folder or
                </span>
                <v-btn
                    class="w-100 border"
                    elevation="0"
                    :text="counterBtnText"
                    :disabled="counterActive"
                    @click="resend"
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
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{ resend: [email?: string] }>()
const props = defineProps<{ time?: number, email?: string, error?: string }>()

// --- Resend Counter
const counterSec = ref(0)
const counterActive = computed(() => isNaN(counterSec.value) || counterSec.value > 0)
const counterBtnText = computed(() => counterActive.value ? `Resend in ${counterSec.value}s` : 'Resend Verification Email')
const counterInterval = ref(null as NodeJS.Timeout | null)

const counterCallback = () => (counterSec.value = Math.round(((props.time ?? 0) - Date.now()) / 1000))

onBeforeMount(() => counterInterval.value = setInterval(counterCallback, 1000))
onBeforeUnmount(() => counterInterval.value && clearInterval(counterInterval.value))

// --- Pass Invoke
const resend = () => emit("resend", props.email)

//

</script>

<style scoped>

</style>