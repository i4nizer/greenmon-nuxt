import prisma from "~/lib/prisma"

//

export default defineEventHandler(async (event) => {
    // --- Deauthenticate
    const refreshToken = getCookie(event, "refresh-token")
    deleteCookie(event, "access-token")
    deleteCookie(event, "refresh-token")
    if (!refreshToken) return sendRedirect(event, "/auth/sign-in")
    
    // --- Validation: Validate refresh token before syncing database.
    const refreshResult = safeVerifyToken(refreshToken, "REFRESH")
    if (!refreshResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: refreshResult.error.message }))
    
    // --- Sync Database
    const user = refreshResult.data as { id: number, name: string, email: string }
    await prisma.token.delete({ where: { userId_type: { type: "REFRESH", userId: user.id } } })

    // --- Redirect
    return sendRedirect(event, "/auth/sign-in")
})