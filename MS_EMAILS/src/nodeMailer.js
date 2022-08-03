import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
        user: '5a5d8c3eb59863',
        pass: 'dadc753e85af74'
    },
    tls: { rejectUnauthorized: false}
})