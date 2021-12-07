import { IBook } from "./types";

export class Book {

    _id?: string;
    isbn: string;
    name: string;
    author: string;
    genre: string;
    pages: number;

    constructor({ _id, isbn, name, author, genre, pages }: IBook) {
        this._id = _id;
        this.isbn = isbn;
        this.name = name;
        this.author = author;
        this.genre = genre;
        this.pages = pages;
    }

}