import { Body, Get, JsonController, Post, Req } from "routing-controllers";
import { Container, ContainerReq } from "../../config/Container";
import { IBook } from "../../domain/entities/types";
import to from "await-to-js";

@JsonController('/books')
export class BookController {

    @Get('/')
    async getBooks(@Req() req: ContainerReq) {
        const { bookService }: Container = req.container.cradle;

        const [err, books] = await to(bookService.getBooks());
        if (err) throw err;

        return books;
    }

    @Post('/')
    async createBook(@Req() req: ContainerReq, @Body() body: IBook) {
        const { bookService }: Container = req.container.cradle;

        const [err, success] = await to(bookService.createBook(body));
        if (err) throw err;

        return {
            success,
            msg: success ? 'Message has been successfully published to queue'
                : 'Message has not been published due to error',
        }
    }

}