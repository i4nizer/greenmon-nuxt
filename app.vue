<template>
    <NuxtLayout :name="layout">
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">

//

// --- Route based layout
const route = useRoute()
const layout = computed(() => {
    const segments = route.path.split("/")
    const slen = segments.length
    const path = route.path

    if (slen <= 1) return "default"
    else if (path.startsWith("/auth")) return "auth"
    else if (path.startsWith("/user") && slen == 3) return "user"
    else return "default"
})

//

</script>