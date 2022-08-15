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

                Your token is: AAj${Math.random(15)*10+8}YkhsA${Math.random(28)*10+5}
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