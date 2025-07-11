<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>User Settings</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-card>
                    <v-card-title>
                        <v-icon>mdi-account-cog</v-icon>
                        <span class="ml-2">Account</span>
                    </v-card-title>
                    <v-card-subtitle class="text-wrap">Manage your account settings and preferences.</v-card-subtitle>
                    <v-card-text>
                        <UserAccountForm
                            v-model:user="user"
                            :error
                            :loading
                            @submit="saveSettings"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Init from Auth State
const authStore = useAuthStore()
const { name, email, phone } = authStore.user
const user = reactive({ name, email, phone })

// --- Bind from store
watch(authStore.user, nv => Object.assign(user, nv))

// --- Update logic
const error = ref<string>()
const loading = ref<boolean>()

const saveSettings = async (data: any) => {
    error.value = undefined
    loading.value = true
    await $fetch("/api/user/settings", { method: "POST", body: data })
        .then(res => Object.assign(authStore.user, res.user))
        .catch(err => error.value = err?.statusMessage)
        .finally(() => loading.value = false)
}

//

</script>

<style scoped>

</style>