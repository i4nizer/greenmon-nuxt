<template>
	<v-container class="fill-height pa-0" fluid>
		<v-row class="h-screen" justify="center">
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
					<RecoveryResetPanel />
				</div>
			</v-col>
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex align-center justify-center h-md-screen">
					<RecoveryResetForm :token="(token as string)" :error :loading @submit="resetPassword" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { UserPasswordReset } from "~~/shared/schema/user"

//

// --- Token: Requires Token Query
const route = useRoute()
const { email, token } = route.query
if (!token) await navigateTo("/auth/recovery/forgot")

// --- Data & Logic
const error = ref<string>()
const loading = ref<boolean>()

//
const resetPassword = async (values: UserPasswordReset) => {
	error.value = undefined
	loading.value = true

	await $fetch("/api/auth/recovery/reset", { method: "POST", body: values })
		.then(async () => await navigateTo(`/auth/recovery/changed${email ? `?email=${email}` : ""}`))
		.catch((err) => (error.value = err?.statusMessage))
		.finally(() => (loading.value = false))
}

//
</script>

<style lang="css" scoped></style>
