import { z } from "zod"
import prisma from "~/lib/prisma"

//

const EmailSchema = z.object({ email: z.string().email() })

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, EmailSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Find Email User
    const user = await prisma.user.findUnique({ where: { email: bodyResult.data.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User already verified." }))
    
    // --- Validation: System anomaly, not verified but no verification token.
    let token = await prisma.token.findFirst({ where: { type: "VERIFY", userId: user.id } })
    if (!token) {
        const payload = user as { id: number, name: string, email: string }
        const verifyToken = createToken(payload, "VERIFY")
        token = await prisma.token.create({ data: { token: verifyToken, type: "VERIFY", userId: user.id } })
    }
    
    // --- Time
    return { time: token.updatedAt.getTime() }
})