#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const queue = 'hello_queue';
        const msg = 'Hello world';

        channel.assertQueue(queue, { durable: false });
        const intervalID = setInterval(() => {
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log("[x] Sent %s", msg);
        }, 2000);

        setTimeout(() => {
            clearInterval(intervalID);
        }, 30000);

    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 35000);
});