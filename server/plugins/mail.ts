import { nodemailer, initMail, handleMail } from "../utils/mail"

//

export default defineNitroPlugin(() => {
    // --- Gmail Transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NUXT_GMAIL_ADDRESS,
            pass: process.env.NUXT_GMAIL_PASSWORD,
        }
    })

    // --- Queue Sending
    initMail(transporter)
    setInterval(() => handleMail(), 100)
    console.log(`✔ Email queue sending plugged in.`)
})