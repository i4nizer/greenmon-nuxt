import { Token } from "~~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Deauthenticate
    const refreshToken = getCookie(event, "refresh-token")
    deleteCookie(event, "access-token")
    deleteCookie(event, "refresh-token")
    if (!refreshToken) return sendRedirect(event, "/auth/sign-in")
    
    // --- Validation: Validate refresh token before syncing database.
    const refreshResult = safeVerifyToken(refreshToken, "Refresh")
    if (!refreshResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: refreshResult.error.message }))
    
    // --- Sync Database
    const user = refreshResult.data as { id: number, name: string, email: string }
    await Token.destroy({ where: { type: "Refresh", userId: user.id } })

    // --- Redirect
    return sendRedirect(event, "/auth/sign-in")
})