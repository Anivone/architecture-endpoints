import { IRepository } from "./types";
import { Book } from "../../domain/entities/Book";
import { IBookModel } from "../schemas/BookSchema";
import to from "await-to-js";
import { IBook } from "../../domain/entities/types";

export class BookRepository implements IRepository<Book> {
    BookModel: IBookModel;

    constructor({ BookModel }: { BookModel: IBookModel }) {
        this.BookModel = BookModel;
    }

    async get(filter?: any): Promise<Book[]> {
        const books = await this.BookModel.find(filter);
        return books.map((book: any) => this.BookModel.toBook(book));
    }

    async getById(id: string): Promise<Book> {
        return this.BookModel.toBook(await this.BookModel.findById(id));
    }

    async create(data: IBook): Promise<Book> {
        const [err, book] = await to<IBook>(new this.BookModel(data).save());
        if (err) throw err;

        return this.BookModel.toBook(book);
    }

    async update(id: string, data: IBook): Promise<Book> {
        return this.BookModel.toBook(await this.BookModel.findByIdAndUpdate(id, data));
    }

    async delete(id: string): Promise<Book> {
        return this.BookModel.toBook(await this.BookModel.findByIdAndRemove(id));
    }
}