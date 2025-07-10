<template>
    <v-container class="fill-height pa-0" fluid>
        <v-row class="h-screen" justify="center">
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
                    <SignInPanel />
                </div>
            </v-col>
            <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex align-center justify-center h-md-screen">
                    <SignInForm 
                        v-model="user"
                        :error
                        :loading
                        @submit="signIn"
                    />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Data & Logic
const user = reactive({ email: "", password: "" })
const error = ref<string>()
const loading = ref<boolean>()

const signIn = async (data: typeof user) => {
    error.value = undefined
    loading.value = true
    await $fetch("/api/auth/sign-in", { method: "POST", body: data })
        .then(() => navigateTo("/user/greenhouse") as void)
        .catch(err => error.value = err?.statusMessage)
        .finally(() => loading.value = false)
}

//

</script>

<style lang="css" scoped></style>
