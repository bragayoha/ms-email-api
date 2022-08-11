const kafka = require('../src/kafka')
const transporter = require('../src/nodeMailer')

const consumer = kafka.consumer({groupId: 'let_bet_us_email'})

const topic = 'let_bet_us_email'

async function runLetBetUsEmail() {
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
                <p> We miss you! C'mon, <a href= > let's bet together! </a>
                </p>`
            }

            transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
                else console.log(`Message sent: ${info}`)
            })
        }
    })
}

module.exports = {runLetBetUsEmail}