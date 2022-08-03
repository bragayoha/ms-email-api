const kafka = require('../src/kafka')
const transporter = require('../src/nodeMailer')

const consumer = kafka.consumer({groupId: 'send_welcome_email'})

const topic = 'send_welcome_email'

async function runSendWelcomeEmail() {
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
                <h1> Welcome ${user.name} </h1>
                <p> We look forward to betting with you! </p>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
                else console.log(`Message sent: ${info}`)
            })
        }
    })
}