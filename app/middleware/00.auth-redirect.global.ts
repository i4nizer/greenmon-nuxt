
// --- For client-side auth based redirection

export default defineNuxtRouteMiddleware(async (to, from) => {
    // --- Client Only
    if (!import.meta.client) return

    // --- Route Check
    const url = to.path
    const isProtected = url.startsWith("/user")
    const isAuthorization = url.startsWith("/auth")

    // --- Token Check
    const accessToken = useCookie("access-token")
    const authorized = !!accessToken.value

    // --- Redirects
    if (isProtected && !authorized) return await navigateTo("/auth/sign-in")
    if (isAuthorization && authorized) return await navigateTo("/user/greenhouse")
})