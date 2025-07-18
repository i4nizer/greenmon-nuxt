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
							:user="authStore.user"
							:action="`/api/user/account`"
							@success="onSaveUserAccount" 
						/>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { UserSafe } from "~~/shared/schema/user"

//

// --- Init from Auth State
const authStore = useAuthStore()

// --- Notif
const { append: appendSnack } = useSnackbarStore()

// --- Sync User
const onSaveUserAccount = (data: UserSafe) => {
	Object.assign(authStore.user, data)
	appendSnack({ text: "User account updated successfully.", color: "success" })
}

//
</script>

<style scoped></style>
