// --- For auth based redirection

export default defineEventHandler(async (event) => {
    // --- Token Check
    const accessToken = getCookie(event, "access-token")
    const refreshToken = getCookie(event, "refresh-token")
    const authorizable = !!accessToken || !!refreshToken
    
    // --- Route Control
    const url = getRequestURL(event)
    const isProtected = url.pathname.startsWith("/user") || url.pathname.startsWith("/api/user")
    const isAuthorization = url.pathname.startsWith("/auth")

    if (isProtected && !authorizable) return await sendRedirect(event, "/auth/sign-in")
    if (isAuthorization && authorizable) return await sendRedirect(event, "/user/greenhouse")
})