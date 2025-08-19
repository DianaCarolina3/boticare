import 'dotenv/config'
import * as process from "node:process";

export const config = {
    api: {
        port: process.env.PORT || 3000,
    }
}