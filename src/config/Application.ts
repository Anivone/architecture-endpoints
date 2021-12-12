import { ExpressConfig } from "./ExpressConfig";
import * as mongoose from 'mongoose';
import "reflect-metadata"
import { Connection } from "mongoose";
import { RabbitConfig } from "./RabbitConfig";
import { Worker } from "./Worker";

export class Application {
    readonly PORT = 8000;
    static readonly MONGO_URL = "mongodb://127.0.0.1:27017/genesis-books";

    server: any;
    express: ExpressConfig;
    rabbit: RabbitConfig;

    public static instance: Application;

    private constructor(connection: Connection, rabbit: RabbitConfig) {
        this.rabbit = rabbit;
        this.express = new ExpressConfig(connection, this.rabbit.channel);

        this.server = this.express.app.listen(process.env.SERVER_PORT || this.PORT, () => {
            console.log('Server is listening on port ' + process.env.SERVER_PORT || this.PORT);
        });
    }

    static async init() {
        if (this.instance) return this.instance;

        const type = process.argv.slice(2)[0];

        const connection = mongoose.createConnection(
            process.env.MONGO_USER
            ? `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
            : this.MONGO_URL);
        const rabbit = await RabbitConfig.init();

        if (type === 'server') {
            this.instance = new Application(connection, rabbit);
            return this.instance;
        }

        new Worker(connection, rabbit.channel);
    }
}
