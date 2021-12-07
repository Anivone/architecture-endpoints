import { Container } from "../../config/Container";
import { Channel } from "amqplib";

export class MessageSender {
    amqpChannel: Channel;

    constructor({ amqpChannel }: Container) {
        this.amqpChannel = amqpChannel;
    }

    sendMessage(queue: string, data: any) {
        return this.amqpChannel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
    }
}