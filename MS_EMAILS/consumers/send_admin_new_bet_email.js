const kafka = require('../src/kafka')
const transporter = require('../src/nodeMailer')

const consumer = kafka.consumer({groupId: 'send_admin_new_bet_email'})

const topic = 'send_admin_new_bet_email'

async function runSendAdminNewBetEmail() {
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
                <h1> Hello, ${user.name}! </h1>
                <p> We have a new bet in our system! </p>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
                else console.log(`Message sent: ${info}`)
            })
        }
    })
}

module.exports = {runSendAdminNewBetEmail}