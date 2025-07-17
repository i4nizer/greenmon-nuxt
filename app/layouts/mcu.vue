<template>
	<v-layout full-height>
		<v-app>
			<!-- The Left Navigation Drawer -->
			<v-navigation-drawer
				class="bg-green-darken-4 position-fixed"
				v-model="drawer"
				:rail="isTablet"
				:permanent="!isMobile"
				:expand-on-hover="isTablet"
			>
				<template #prepend>
					<v-list>
						<v-list-item
							link
							v-tooltip="`Return to User Page`"
							to="/user/greenhouse"
							prepend-icon="mdi-account"
							:title="user.name"
							:subtitle="user.email"
						></v-list-item>
					</v-list>
					<v-divider></v-divider>
					<v-list>
						<v-list-item
							link
							v-tooltip="`Return to Greenhouse Page`"
							prepend-icon="mdi-sprout"
							:to="`/user/greenhouse/${gid}/mcu`"
							:title="greenhouse?.name"
						></v-list-item>
					</v-list>
				</template>
				<v-divider></v-divider>
				<v-list density="compact" nav>
					<v-list-subheader>{{ mcu?.name }}</v-list-subheader>
					<v-list-item
						link
						title="Pins"
						prepend-icon="mdi-sine-wave"
						:to="`/user/greenhouse/${gid}/mcu/${mid}/pins`"
					></v-list-item>
					<v-list-item
						link
						title="Sensors"
						prepend-icon="mdi-thermometer"
						:to="`/user/greenhouse/${gid}/mcu/${mid}/sensors`"
					></v-list-item>
				</v-list>
				<template #append>
					<v-divider></v-divider>
					<v-list density="compact">
						<v-list-item link title="Sign Out" prepend-icon="mdi-logout" @click="signOut"></v-list-item>
					</v-list>
				</template>
			</v-navigation-drawer>

			<!-- Top Navigation -->
			<v-app-bar class="bg-green">
				<v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer" />
				<v-icon size="large" class="pl-6 pl-md-8">mdi-leaf</v-icon>
				<v-toolbar-title>Greenmon</v-toolbar-title>
			</v-app-bar>

			<!-- Contents -->
			<v-main>
				<div class="w-100 h-100 bg-doa-centered">
					<slot></slot>
				</div>
			</v-main>
		</v-app>
	</v-layout>
</template>

<script setup lang="ts">
import type { Mcu } from "~~/shared/schema/mcu"
import type { Greenhouse } from "~~/shared/schema/greenhouse"

//

// --- Display
const { mdAndDown, smAndDown } = useDisplay()
const drawer = ref(!smAndDown.value)
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

// --- Fetch Routed Mcu & Greenhouse
const route = useRoute()
const { gid, mid } = route.params
const { data: mcu } = await useFetch<Mcu>(`/api/user/greenhouse/${gid}/mcu/${mid}`, { lazy: true })
const { data: greenhouse } = await useFetch<Greenhouse>(`/api/user/greenhouse/${gid}`, { lazy: true })

// --- Sync Auth Store
const authStore = useAuthStore()
const { user, dehydrate } = authStore

// --- Sign Out
const signOut = async () => {
	await $fetch("/api/auth/sign-out", { method: "POST" }).catch((err) => import.meta.dev && console.error(err))

	dehydrate()
	await navigateTo("/auth/sign-in")
}

//
</script>

<style scoped>
.bg-doa-centered {
	position: relative;
	overflow: hidden;
}

.bg-doa-centered::before {
	content: "";
	position: absolute;
	inset: 0;
	background-image: url("/images/bg-doa.png");
	background-size: clamp(200px, 40vw, 400px);
	background-repeat: no-repeat;
	background-position: center;
	filter: opacity(0.5);
	z-index: 0;
	pointer-events: none;
}
</style>
