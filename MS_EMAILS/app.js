"use strict"

const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'client',
    brokers: ['kafka:9092'],
})

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})