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

        // Assumption: The routing keys will have words delimited
        // by '.': <facility>.<severity>

        const exchange = 'topic_logs';
        const args = process.argv.slice(2); // get command line args
        const msg = args.slice(1).join(' ') || 'Hello world'; // get second argument in array
        const key = args.length > 0 ? args[0] : 'anonymous.info.here';

        // direct exchange mechanism
        channel.assertExchange(exchange, 'topic', { durable: false });

        channel.publish(exchange, key, Buffer.from(msg));

        console.log("[x] Sent %s: %s", key, msg);

    });
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 500);
});