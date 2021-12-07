import { Get, JsonController } from "routing-controllers";

@JsonController('/test')
export class TestController {
    @Get('/')
    async getTest() {
        return {
            msg: 'Hello World !'
        }
    }
}