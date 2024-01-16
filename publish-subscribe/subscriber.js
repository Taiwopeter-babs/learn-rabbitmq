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

        const exchange = 'logs';

        // all subscribers get the message from the producer/publisher
        channel.assertExchange(exchange, 'fanout', { durable: false });


        // A fresh empty queue will be created on every connection
        // and on disconnection of the consumer, the queue will be deleted
        channel.assertQueue('', { exclusive: true }, function (error2, appQueue) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for messages in %s, To exit press CTRL+C", appQueue.queue);
            // binds an exchange to a queue
            channel.bindQueue(appQueue.queue, exchange, '');

            channel.consume(appQueue.queue, function (msg) {
                if (msg.content) {
                    console.log(" [x] %s", msg.content.toString());
                }
            }, {
                noAck: true
            });
        });

    });
});