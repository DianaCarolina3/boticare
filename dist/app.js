import express from 'express';
import router from "./routes.js";
import { config } from './config/config.js';
const app = express();
app.use(express.json());
app.disable('x-powered-by');
app.use('/', router);
app.listen(config.api.port, () => {
    console.log(`Server listening on the http://localhost:${config.api.port}`);
});
//# sourceMappingURL=app.js.map