import User from 'App/Models/User'
import { Kafka } from 'kafkajs'

const kafka = new Kafka({
  clientId: 'api',
  brokers: ['localhost:9092'],
  retry: {
    initialRetryTime: 300,
    retries: 5,
  }
})

const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000
})

export async function sendMail(user: User, subject: string, topic: string, info?: {}): Promise<void> {
  await producer.connect()

  const message = {
    user: user,
    subject: subject,
    info: info,
  }

  await producer.send({
    topic: topic,
    messages: [
      { value: JSON.stringify(message)}
    ]
  })
}
