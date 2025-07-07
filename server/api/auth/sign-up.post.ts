import bcrypt from "bcrypt"
import { SendMailOptions } from "nodemailer"
import prisma from "~/lib/prisma"
import { safeSendMail } from "~/server/utils/mail"
import { renderTemplate } from "~/server/utils/template"
import { createToken } from "~/server/utils/token"
import { UserSchema } from "~/shared/schema/user"

//

const SignUpUserSchema = UserSchema.pick({
    name: true,
    email: true,
    password: true,
})

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const { data, error, success } = await readValidatedBody(event, SignUpUserSchema.safeParse)
    if (!success) return sendError(event, createError({ statusCode: 400, statusMessage: error.message }))
    
    // --- Email must not be taken
    const emailUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (emailUser != null) return sendError(event, createError({ statusCode: 400, statusMessage: "Email taken." }))
    
    // --- Encryption
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({ data: { ...data, password: passwordHash } })

    // --- Token
    const payload = user as { id: number, name: string, email: string }
    const verifyToken = createToken(payload, "VERIFY")
    const token = await prisma.token.create({ data: { token: verifyToken, type: "VERIFY", userId: user.id } })
    
    // --- Email Verification
    const url = `${getRequestProtocol(event)}://${getRequestHost(event)}/auth/verification/verify`
    const query = `?email=${user.email}&token=${token.token}`
    const renderResult = await safeRenderTemplate("VERIFICATION", { name: user.name, link: url + query })
    if (!renderResult.success) return sendError(event, createError({ statusCode: 500, statusMessage: "Failed to send email, render failed." }))
    const mail: SendMailOptions = { to: user.email, subject: "Account Verification - Greenmon", html: renderResult.data }
    event.waitUntil(safeSendMail(mail))
    
    // --- Redirection with Email to Display Sent
    return sendRedirect(event, `/auth/verification/sent?email=${user.email}`)
})