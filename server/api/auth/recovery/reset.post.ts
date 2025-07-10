import type { SendMailOptions } from "nodemailer"
import { z } from "zod"
import bcrypt from "bcrypt"
import { Token, User } from "~/server/models"

//

const ResetPasswordSchema = z.object({
    password: z.string().min(8),
    confirm: z.string().min(8),
    token: z.string().jwt()
})

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, ResetPasswordSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    const match = bodyResult.data.confirm === bodyResult.data.password
    if (!match) return sendError(event, createError({ statusCode: 400, statusMessage: "Passwords doesn't match." }))
    
    // --- Validate Token
    const tokenResult = safeVerifyToken<{ id: number; name: string; email: string }>(bodyResult.data.token, "Reset")
    if (!tokenResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: tokenResult.error.message }))
    const payload = tokenResult.data
    
    // --- Find Token
    const token = await Token.findOne({ where: { type: "Reset", value: bodyResult.data.token, userId: payload.id } })
    if (!token) return sendError(event, createError({ statusCode: 400, statusMessage: "User didn't request for password reset." }))
    
    // --- Check Email User
    const user = await User.findOne({ where: { email: payload.email } })
    if (!user) return sendError(event, createError({ statusCode: 400, statusMessage: "Email not registered." }))
    if (!user.verified) return sendError(event, createError({ statusCode: 400, statusMessage: "User not verified." }))
    
    // --- Hash & Update Password & Drop Token
    const passwordHash = await bcrypt.hash(bodyResult.data.password, 10)
    await User.update({ password: passwordHash }, { where: { id: user.id } })
    await Token.destroy({ where: { type: "Reset", userId: user.id } })

    // --- Inform User
    const renderResult = await safeRenderTemplate("Reset-Password-Success", { name: user.name })
    if (!renderResult.success) return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
    const mail: SendMailOptions = { to: user.email, subject: "Password Changed - Greenmon", html: renderResult.data }
    event.waitUntil(safeSendMail(mail))

    // --- Redirect to Display Changed Password
    return sendRedirect(event, `/auth/recovery/changed?email=${user.email}`)
})