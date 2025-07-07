<template>
    <NuxtLayout :name="layout">
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">

// --- Route based layout

const route = useRoute()
const layout = computed(() =>
    route.path.startsWith("/auth") ? "auth" :
    route.path.startsWith("/user") ? "user" :
    "default"
)

//

</script>