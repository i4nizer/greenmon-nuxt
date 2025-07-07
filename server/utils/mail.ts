import nodemailer from "nodemailer"
import type { SendMailOptions, SentMessageInfo } from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"

//

type Mail = SendMailOptions & {
    sent: boolean,
    attempts: number,
    callback?: (err: Error | null, info: SentMessageInfo) => void
}
type SafeSendMailResult =
    { data: SentMessageInfo, error?: undefined, success: true }
    | { data?: undefined, error: Error, success: false }

//

const mailQueue: Mail[] = []
const mailState = { occupied: false }
const mailConfig = { transporter: null as nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> | null }

//

const initMail = (transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>) => {
    mailConfig.transporter = transporter
}

const sendMail = (mailOptions: SendMailOptions): Promise<SentMessageInfo> => new Promise((resolve, reject) => {
    if (!mailConfig.transporter) return reject(new Error("Email transporter not initialized, call initMail() first."));

    const callback = (err: Error | null, info: SentMessageInfo) => {
        if (err) console.log(`Email failed sending to ${mailOptions.to}.`)
        else console.log(`Email success sent to ${mailOptions.to}.`)
        return err ? reject(err) : resolve(info)
    }
    
    mailConfig.transporter.sendMail(mailOptions, callback)
})

const queueMail = (mailOptions: SendMailOptions, callback?: (err: Error | null, info: SentMessageInfo) => void) => {
    if (!mailConfig.transporter) throw new Error("Email transporter not initialized, call initMail() first.");

    const mail: Mail = { ...mailOptions, sent: false, attempts: 0, callback }
    mailQueue.push(mail)
    console.log(`Email queued send to ${mail.to}.`)
}

const handleMail = async () => {
    if (mailQueue.length <= 0 || mailState.occupied || !mailConfig.transporter) return;
    
    const mail = mailQueue.shift()
    if (!mail) return;

    mailState.occupied = true
    await sendMail(mail as SendMailOptions)
        .then(info => mail.callback && mail.callback(null, info))
        .then(() => mail.sent = true)
        .catch(error => mail.callback && mail.callback(error, <SentMessageInfo>{}))
    
    mail.attempts += mail.sent ? 1 : 0
    if (!mail.sent && mail.attempts < 5)
    mailState.occupied = false
}

const safeSendMail = (mailOptions: SendMailOptions): Promise<SafeSendMailResult> => new Promise((resolve, reject) => {
    if (!mailConfig.transporter) return reject(new Error("Email transporter not initialized, call initMail() first."));

    const callback = (err: Error | null, info: SentMessageInfo) => {
        if (err) console.log(`Email failed sending to ${mailOptions.to}.`)
        else console.log(`Email success sent to ${mailOptions.to}.`)
        return err ? resolve({ error: err, success: false  }) : resolve({ data: info, success: true })
    }
    
    mailConfig.transporter.sendMail(mailOptions, callback)
})

//

export {
    type Mail,
    type SafeSendMailResult,
    nodemailer,
    initMail,
    sendMail,
    queueMail,
    handleMail,
    safeSendMail,
}