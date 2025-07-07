// --- For refresh token validation

import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
    // --- Route Access Check
    if (event.context?.requiresAuth === undefined) {
        const url = getRequestURL(event)
        const requiresAuth = url.pathname.startsWith("/user") || url.pathname.startsWith("/api/user")
        event.context.requiresAuth = requiresAuth
    }
    
    // --- No Checking Required
    if (!event.context.requiresAuth) return;
    if (event.context?.accessTokenState === "VERIFIED") return;

    // --- accessTokenState: EXPIRED | INVALID | MISSING
    const refreshToken = getCookie(event, "refresh-token")
    if (!refreshToken) throw createError({ statusCode: 401, statusMessage: "Authentication required." })
    
    // --- Find Refresh Token
    const token = await prisma.token.findFirst({ where: { type: "VERIFY", token: refreshToken } })
    if (!token) {
        deleteCookie(event, "access-token")
        deleteCookie(event, "refresh-token")
        throw createError({ statusCode: 401, statusMessage: "Authentication error, kindly sign-in again." })
    }
        
    // --- Verify Refresh Token
    const refreshTokenResult = safeVerifyToken(refreshToken, "REFRESH")
    if (!refreshTokenResult.success) {
        deleteCookie(event, "access-token")
        deleteCookie(event, "refresh-token")
        
        const expired = refreshTokenResult.error instanceof jwt.TokenExpiredError
        const errorMsg = expired ? "Session expired, kindly sign-in again." : "Authentication error, kindly sign-in again."
        throw createError({ statusCode: 401, statusMessage: errorMsg })
    }

    // --- Rotate Tokens
    const config = useRuntimeConfig()
    const payload = refreshTokenResult.data as { id: number, name: string, email: string }
    const newAccessToken = createToken(payload, "ACCESS")
    const newRefreshToken = createToken(payload, "REFRESH")

    // --- Server-Client Cookie
    setCookie(event, "access-token", newAccessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtAccessLife
    })
    
    // --- Server-Only Cookie
    setCookie(event, "refresh-token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: config.jwtRefreshLife
    })

    // --- Sync Database
    await prisma.token.update({
        data: { token: refreshToken },
        where: { userId_type: { type: "REFRESH", userId: payload.id } }
    })

    console.log("TOKENS ROTATED")
})