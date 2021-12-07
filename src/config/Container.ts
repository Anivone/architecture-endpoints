import * as awilix from 'awilix';
import { Request } from 'express';
import { Connection } from "mongoose";
import { BookRepository } from "../data/repositories/BookRepository";
import mongoModelsConfig from "./MongoConfig";
import { BookService } from "../infrastructure/services/BookService";
import { IBookModel } from "../data/schemas/BookSchema";
import { Channel } from "amqplib";
import { MessageSender } from "../infrastructure/messaging/MessageSender";

export interface ContainerReq extends Request {
    container: awilix.AwilixContainer;
}

export interface Container {
    amqpChannel: Channel,
    messageSender: MessageSender,
    BookModel: IBookModel,
    bookRepository: BookRepository,
    bookService: BookService,
}

export function makeContainer(connection: Connection, amqpChannel: Channel) {
    const container = awilix.createContainer();
    const { bookModel } = mongoModelsConfig(connection);

    container.register({
        // Config
        amqpChannel: awilix.asValue(amqpChannel),

        // Models
        BookModel: awilix.asValue(bookModel),

        // Repositories
        bookRepository: awilix.asClass(BookRepository).singleton(),

        // Services
        bookService: awilix.asClass(BookService).singleton(),

        messageSender: awilix.asClass(MessageSender).singleton(),
    });

    return container;
}