import { Kafka } from 'kafkajs'

const kafka = new Kafka({
    clientId: 'ms_api',
    brokers: ['localhost:9092'],
})

module.exports = kafka
