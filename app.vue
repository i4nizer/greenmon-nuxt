<template>
    <NuxtLayout :name="layout">
        <NuxtPage />
    </NuxtLayout>
    <v-snackbar-queue v-model="snackbarStore.queue" />
</template>

<script setup lang="ts">

//

// --- Just Set Page Title
useHead({ title: "Greenmon" })

// --- Route based layout
const route = useRoute()
const layout = computed(() => {
    const segments = route.path.split("/")
    const slen = segments.length
    const path = route.path

    if (slen <= 1) return "default"
    else if (path.startsWith("/auth")) return "auth"
    else if (path.startsWith("/user") && slen == 3) return "user"
    else if (path.startsWith("/user/greenhouse") && slen == 5) return "greenhouse"
    else if (slen == 7 && segments.at(4) == "mcu") return "mcu"
    else return "default"
})

// --- Simple Notif Display
const snackbarStore = useSnackbarStore()

//

</script>