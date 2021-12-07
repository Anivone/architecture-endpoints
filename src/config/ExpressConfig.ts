import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import { useExpressServer } from "routing-controllers";
import { AwilixContainer } from "awilix";
import { scopePerRequest } from "awilix-express";
import { makeContainer } from "./Container";
import { Connection } from "mongoose";
import { Channel } from "amqplib";
import { RedisConfig } from "./RedisConfig";

export class ExpressConfig {
    app: express.Express;
    container: AwilixContainer;

    constructor(connection: Connection, amqpChannel: Channel) {
        this.app = express();

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        new RedisConfig();

        this.container = makeContainer(connection, amqpChannel);
        this.app.use(scopePerRequest(this.container));

        this.setUpControllers();
    }

    private setUpControllers() {
        const controllerPath = path.resolve('src', 'infrastructure', 'controllers');
        useExpressServer(this.app, {
            controllers: [controllerPath + '/*.ts'],
        });
    }

}