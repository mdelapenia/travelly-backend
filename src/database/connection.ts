import mysql from "mysql2/promise";

import { env } from "../config/env";

export const db = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    waitForConnections: true,
    multipleStatements: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    maxIdle: 10,
    idleTimeout: 10 * 60 * 1000,
    connectTimeout: 10000
});