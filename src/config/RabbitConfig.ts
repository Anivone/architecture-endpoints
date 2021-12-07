import * as amqp from 'amqplib';
import to from "await-to-js";

export class RabbitConfig {
    static readonly QUEUE_URL =
        'amqps://tgeemdwp:FiIe1INqVd57YjKhLNapoLfBFkSCT4Uh@cow.rmq2.cloudamqp.com/tgeemdwp';
    static readonly QUEUE_NAME = 'books-queue';

    static instance: RabbitConfig;

    channel: amqp.Channel;

    private constructor(channel: amqp.Channel) {
        this.channel = channel;
    }

    static async init() {
        if (this.instance) return this.instance;

        const [err, connection] = await to(amqp.connect(this.QUEUE_URL));
        if (err) throw err;

        const [err2, channel] = await to(connection.createChannel());
        if (err2) throw err2;

        channel.assertQueue(this.QUEUE_NAME, {
            durable: false
        });

        process.on('exit', () => {
            channel.close();
        });

        this.instance = new RabbitConfig(channel);
        return this.instance;
    }

}