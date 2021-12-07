import { Connection } from "mongoose";
import BookSchema, { IBookDocument, IBookModel } from "../data/schemas/BookSchema";

export default function mongoModelsConfig(connection: Connection) {
    const bookModel: IBookModel = connection.model<IBookDocument, IBookModel>('Book', BookSchema);

    return {
        bookModel
    }
}