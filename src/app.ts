import express from 'express'
import router from "./routes.ts";
import { config } from './core/config/config.ts'
import {handlerError} from "./shared/response/ApiResponse.ts";

const app = express()

app.use(express.json())
app.disable('x-powered-by')

app.use('/', router)

app.use(handlerError)

app.listen(config.api.port, (): void => {
    console.log(`Server listening on the http://${config.api.host}:${config.api.port}`)
    console.log(`Running in mode ${process.env.NODE_ENV}`)
})
