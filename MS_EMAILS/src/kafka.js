const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'ms_api',
    brokers: ['localhost:9092'],
    retry: {
        initialRetryTime: 300,
        retries: 5,
    }
})

module.exports = kafka
