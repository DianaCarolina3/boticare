import 'dotenv/config'
import * as process from "node:process";

export const config = {
    api: {
        port: process.env.API_PORT,
        host: process.env.API_HOST
    },
    dbPostgres: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    }
}