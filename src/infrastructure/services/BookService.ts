import { BookRepository } from "../../data/repositories/BookRepository";
import { IBook } from "../../domain/entities/types";
import { Container } from "../../config/Container";
import { MessageSender } from "../messaging/MessageSender";
import { Book } from "../../domain/entities/Book";
import { RabbitConfig } from "../../config/RabbitConfig";

export class BookService {
    private bookRepository: BookRepository;
    private messageSender: MessageSender;

    constructor({ bookRepository, messageSender }: Container) {
        this.bookRepository = bookRepository;
        this.messageSender = messageSender;
    }

    async getBooks(filter?: any): Promise<IBook[]> {
        return await this.bookRepository.get(filter);
    }

    async getBookById(id: string): Promise<IBook> {
        return await this.bookRepository.getById(id);
    }

    async createBook(data: IBook): Promise<boolean> {
        return this.messageSender.sendMessage(RabbitConfig.QUEUE_NAME, new Book(data));
    }

    async updateBook(id: string, data: IBook): Promise<IBook> {
        return await this.bookRepository.update(id, data);
    }

    async deleteBook(id: string): Promise<IBook> {
        return await this.bookRepository.delete(id);
    }

}