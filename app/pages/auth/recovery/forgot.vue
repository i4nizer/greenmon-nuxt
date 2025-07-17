<template>
	<v-container class="fill-height pa-0" fluid>
		<v-row class="h-screen" justify="center">
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
					<RecoveryForgotPanel />
				</div>
			</v-col>
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex align-center justify-center h-md-screen">
					<RecoveryForgotForm :error :loading @submit="forgotPassword" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { UserEmail } from "~~/shared/schema/user"

//

// --- Data & Logic
const error = ref<string>()
const loading = ref<boolean>()

//
const forgotPassword = async (data: UserEmail) => {
	error.value = undefined
	loading.value = true

	await $fetch("/api/auth/recovery/forgot", { method: "POST", body: data })
		.then(async () => await navigateTo(`/auth/recovery/sent?email=${data.email}`))
		.catch((err) => (error.value = err?.statusMessage))
		.finally(() => (loading.value = false))
}

//
</script>

<style lang="css" scoped></style>
