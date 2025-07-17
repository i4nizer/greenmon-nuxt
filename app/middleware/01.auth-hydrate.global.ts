
// --- For partial server-side and spa mode client-side auth store hydration

export default defineNuxtRouteMiddleware(async (to, from) => {
    // --- Route check
    const isProtected = to.path.startsWith("/user")
    if (!isProtected) return

    // --- Check auth state
    const authStore = useAuthStore()
    const hydrateStore = () => authStore.hydrate().catch(async () => navigateTo("/auth/sign-in"))
    
    // --- Hydrates server-side when available
    if (!authStore.hydrated) await hydrateStore()
})