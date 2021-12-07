import * as mongoose from 'mongoose';
import { createClient } from 'redis';

export class RedisConfig {
    static client: any;

    constructor() {
        RedisConfig.client = createClient();
        RedisConfig.client.connect();

        process.on('exit', () => {
            RedisConfig.client.disconnect();
        });

        this.setUpMongoose();
    }

    setUpMongoose() {
        const exec = mongoose.Query.prototype.exec;

        mongoose.Query.prototype.exec = async function () {
            const key = JSON.stringify({
                ...this.getQuery(),
                collection: this.mongooseCollection.name,
                op: this.op,
                options: this.options
            });
            console.log('key: ', JSON.parse(key));

            const cacheValue = await RedisConfig.client.get(key);
            if (cacheValue) {
                console.log('Result from Redis cache')
                return JSON.parse(cacheValue);
            }

            const result = await exec.apply(this, arguments);
            if (result) {
                RedisConfig.client.set(key, JSON.stringify(result), {
                    EX: 10,
                });
            }

            console.log('Result from MongoDB query');

            return result;
        };
    }
}
