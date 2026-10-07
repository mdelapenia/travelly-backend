import app from "./app";

import { env } from "./config/env";

import { db } from "./database/connection";

import { migrate } from "./database/migrate";

async function startServer(): Promise<void> {
    try {
        await db.query("SELECT 1");

        console.log("MySQL conectado correctamente.");

        await migrate(db);

        app.listen(env.port, () => {
            console.log(
                `Travelly API funcionando en http://localhost:${env.port}`
            );
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor.");
        console.error(error);

        process.exit(1);
    }
}

startServer();