import { Schema, Model, Document, Query } from "mongoose";
import { IBook } from "../../domain/entities/types";
import { Book } from "../../domain/entities/Book";

export interface IBookDocument extends Omit<IBook, '_id'>, Document {
}

export interface IBookModel extends IBook, Model<IBookDocument> {
    toBook(book: IBook): Book;
}

const BookSchema: Schema<IBookDocument> = new Schema<IBookDocument>({
    isbn: {
        type: Schema.Types.String,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: true,
    },
    author: {
        type: Schema.Types.String,
        required: true,
    },
    genre: {
        type: Schema.Types.String,
        required: true,
    },
    pages: {
        type: Schema.Types.Number,
        required: true,
    },
});

BookSchema.statics.toBook = (book: IBook) => new Book({
    _id: book._id.toString(),
    isbn: book.isbn,
    name: book.name,
    author: book.author,
    genre: book.genre,
    pages: book.pages,
});

export default BookSchema;
