import * as nodemailer  from 'nodemailer';
import config from 'config';

 const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: config.get('email.GMAIL_USER'),
      pass: config.get('email.GMAIL_PASSWORD'),
    },
})

export default class Mailer {
    async send({ email, subject, html,attachments }) {
        try {
            await mailTransporter.sendMail({
                from: 'hanioapptest@gmail.com', // sender address
                to: email,
                subject,
                html,
                attachments
            })
            return { isEmailSent: true }
        } catch (error) {
            return { isEmailSent: false, error }
        }
    }
}