<template>
	<v-container class="fill-height pa-0" fluid>
		<v-row class="h-screen" justify="center">
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex flex-column justify-space-evenly bg-green-darken-2 pa-12">
					<VerificationSuccessPanel />
				</div>
			</v-col>
			<v-col cols="12" md="6" class="pa-0">
				<div class="d-flex align-center justify-center h-md-screen">
					<VerificationSuccessCard @counter-end="redirect" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
//

// --- Email: Optional Email Query
const route = useRoute()
const { email } = route.query

// --- Redirect
const redirect = async () => await navigateTo(`/auth/sign-in${email ? `?email=${email}` : ""}`)

//
</script>

<style scoped></style>
