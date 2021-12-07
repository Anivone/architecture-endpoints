import { Application } from "./config/Application";

const type = process.argv.slice(2)[0];

Application.init().then((instance: Application) => {
    console.log(`Application of type '${type}' has been initialized !`);

    if (type !== 'server') return;

    process.on('SIGTERM', () => {
        instance.server.close(() => {
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        instance.server.close(() => {
            process.exit(0);
        })
    })
});