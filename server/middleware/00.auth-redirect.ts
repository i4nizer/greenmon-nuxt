// --- For auth based redirection

export default defineEventHandler(async (event) => {
    // --- Token Check
    const accessToken = getCookie(event, "access-token")
    
    // --- Route Control
    const url = getRequestURL(event)
    const isProtected = url.pathname.startsWith("/user") || url.pathname.startsWith("/api/user")
    const isAuthorization = url.pathname.startsWith("/auth")

    if (isProtected && !accessToken) return await sendRedirect(event, "/auth/sign-in")
    if (isAuthorization && accessToken) return await sendRedirect(event, "/user/greenhouse")
})