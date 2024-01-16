#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: subscribe-direct_exchange.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }
    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        const exchange = 'direct_logs';

        // subscribers get the message from the producer/publisher exchange they subscribed to
        channel.assertExchange(exchange, 'direct', { durable: false });


        // A fresh empty queue will be created on every connection
        // and on disconnection of the consumer, the queue will be deleted
        channel.assertQueue('', { exclusive: true }, function (error2, appQueue) {
            if (error2) {
                throw error2;
            }
            console.log(" [*] Waiting for logs. To exit press CTRL+C");

            // create a new binding for each severity of interest
            args.forEach((severity) => {
                // binds an exchange to a queue
                channel.bindQueue(appQueue.queue, exchange, severity);
            })


            channel.consume(appQueue.queue, function (msg) {
                if (msg.content) {
                    console.log(" [x] %s: %s", msg.fields.routingKey, msg.content.toString());
                }
            }, {
                noAck: true
            });
        });

    });
});