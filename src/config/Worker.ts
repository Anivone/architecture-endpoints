import { Connection } from "mongoose";
import { Channel } from "amqplib";
import mongoModelsConfig from "./MongoConfig";
import { BookRepository } from "../data/repositories/BookRepository";
import { RabbitConfig } from "./RabbitConfig";
import to from "await-to-js";

export class Worker {
    private connection: Connection;
    private amqpChannel: Channel;
    private bookRepository: BookRepository;

    constructor(connection: Connection, amqpChannel: Channel) {
        this.connection = connection;
        this.amqpChannel = amqpChannel;

        const { bookModel } = mongoModelsConfig(connection);
        this.bookRepository = new BookRepository({ BookModel: bookModel });

        this.setUpWorker().then(() => {});
    }

    async setUpWorker() {
        const [err] = await to(this.amqpChannel.consume(RabbitConfig.QUEUE_NAME, async (msg) => {
            console.log('......');
            console.log('Message: ', msg.content.toString());
            const message = JSON.parse(msg.content.toString());

            const [err, book] = await to(this.bookRepository.create(message));
            if (err) throw err;

            console.log('Book created: ', book);
        }));
        if (err) throw err;
    }
}