<template>
	<v-container class="fill-height pa-0" fluid>
		<v-row class="h-screen" justify="center">
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
					<RecoverySentPanel />
				</div>
			</v-col>
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex align-center justify-center h-md-screen">
					<RecoverySentCard 
						:time 
						:error 
						:email="(email as string)" 
						@resend="resend" 
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
const { email } = route.query
if (!email) await navigateTo("/auth/sign-up")

// --- Data & Logic
const time = ref<number>(0)
const error = ref<string>()

onNuxtReady(() =>
	$fetch("/api/auth/recovery/time", { method: "POST", body: { email: email as string } })
		.then((res) => (time.value = res.time + 60000))
		.catch(async () => await navigateTo("/auth/recovery/forgot"))
)

const resend = async () => {
	await $fetch("/api/auth/recovery/resend", { method: "POST", body: { email: email as string } })
		.then((res) => (time.value = res.time + 60000))
		.catch((err) => (error.value = err?.statusMessage))
}

//
</script>

<style lang="css" scoped></style>
