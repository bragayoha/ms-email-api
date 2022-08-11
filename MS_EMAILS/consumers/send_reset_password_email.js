const kafka = require('../src/kafka')
const transporter = require('../src/nodeMailer')

const consumer = kafka.consumer({groupId: 'reset_password_email'})

const topic = 'reset_password_email'

async function runResetPasswordEmail() {
    await consumer.connect()

    await consumer.subscribe({topic: topic})

    await consumer.run({
        eachMessage: async ({message}) => {
            const {user, subject, info} = JSON.parse(message.value)

            const mailOptions = {
                from: 'loterysystem@email.com',
                to: user.email,
                subject: subject,
                html: `
                <h1> Hello ${user.name} </h1>

                <p> You requested to reset your password.

                Your token is: ${user.rememberMeToken}
                </p>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
                else console.log(`Message sent: ${info}`)
            })
        }
    })
}

module.exports = {runResetPasswordEmail}