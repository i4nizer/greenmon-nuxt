<template>
    <v-card class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75 elevation-0">
        <v-card-text>
            <div class="d-flex flex-column align-center ga-3">
                <v-icon size="xxx-large" class="text-red">mdi-close-circle</v-icon>
                <h2 class="text-red">Verification Failed</h2>
                <span class="text-wrap text-grey-darken-3 text-center font-weight-bold">
                    Reason: {{ props.reason ?? `We couldn't verify your Greenmon account. 
                    This could be due to an expired or invalid verification link.` }}
                </span>
                <div class="bg-grey-lighten-4 rounded w-100 py-4 px-5">
                    <span class="text-grey-darken-1">Redirecting to verification page in:</span>
                    <br><span class="text-grey-darken-3 text-h4 font-weight-bold">{{ counter }}</span>
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
                    :to="`/auth/verification/sent?email=${props.email}`"
                ></v-btn>
                <NuxtLink class="text-grey" to="/auth/sign-up">Try with a different email</NuxtLink>
                <NuxtLink class="text-grey" to="/auth/sign-in">Already verified? Sign in to dashboard</NuxtLink>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">

//

// --- Data Binding
const emit = defineEmits<{ "counter-end": [] }>()
const props = defineProps<{ email: string, reason?: string }>()

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