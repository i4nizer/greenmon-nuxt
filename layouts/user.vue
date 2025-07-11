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
                            prepend-icon="mdi-account"
                            :title="user.name"
                            :subtitle="user.email"
                        ></v-list-item>
                    </v-list>
                </template>
                <v-divider></v-divider>
                <v-list density="compact" nav>
                    <v-list-item link to="/user/greenhouse" title="Greenhouse" prepend-icon="mdi-sprout"></v-list-item>
                    <v-list-item link to="/user/settings" title="Settings" prepend-icon="mdi-cog"></v-list-item>
                </v-list>
                <template #append>
                    <v-divider></v-divider>
                    <v-list density="compact">
                        <v-list-item
                            link
                            title="Sign Out"
                            prepend-icon="mdi-logout"
                            @click="signOut"
                        ></v-list-item>
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

//

// --- Display
const { mdAndDown, smAndDown } = useDisplay()
const drawer = ref(!smAndDown.value)
const isMobile = computed(() => smAndDown.value)
const isTablet = computed(() => !isMobile.value && mdAndDown.value)

// --- Require Access Token
const accessToken = useCookie("access-token")
if (!accessToken.value) await navigateTo("/auth/sign-in")

// --- Sync Auth Store
const authStore = useAuthStore();
const { user, hydrated, hydrate, dehydrate } = authStore

const hydrateStore = () => hydrate().catch(() => (navigateTo("/auth/sign-in") && dehydrate()))

onNuxtReady(() => !hydrated && hydrateStore())
onServerPrefetch(() => hydrateStore())

// --- Sign Out
const signOut = async () => {
    await $fetch("/api/auth/sign-out", { method: "POST" })
        .catch(err => (import.meta.dev && console.error(err)))
        .finally(() => navigateTo("/auth/sign-in"))
    dehydrate()
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