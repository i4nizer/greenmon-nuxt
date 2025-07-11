// --- For access token verification

export default defineEventHandler(async (event) => {
    // --- Route Access Check
    const url = getRequestURL(event)
    const requiresAuth = url.pathname.startsWith("/user") || url.pathname.startsWith("/api/user")
    const accessToken = getCookie(event, "access-token")
    event.context.requiresAuth = requiresAuth
    
    // --- Determine Token State
    if (requiresAuth && accessToken) {
        const { data, error, success } = safeVerifyToken(accessToken, "Access")
        if (success) {
            event.context.accessTokenState = "VERIFIED"
            event.context.accessTokenPayload = data
        }
        else {
            event.context.accessTokenState = error instanceof jwt.TokenExpiredError ? "EXPIRED" : "INVALID"
            deleteCookie(event, "access-token")
        }
    }

    // --- Missing Token
    if (requiresAuth && !accessToken) event.context.accessTokenState = "MISSING"
})