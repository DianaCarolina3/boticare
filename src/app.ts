import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import router from './routes.js';
import { config } from './core/config/config.js';
import { handlerError } from './shared/response/ApiResponse.js';

const app = express();

app.use(express.json());
app.disable('x-powered-by');

app.use('/', router);

app.get('/', (_req: Request, res: Response) => {
   res.status(200).json({
      hello: 'Recipes',
   });
});

// Si una ruta no existe devuelve message
app.use((_req: Request, res: Response, _next: NextFunction) => {
   res.status(404).json({
      message: 'Not Found',
   });
});

app.use(handlerError);

app.listen(config.api.port, (): void => {
   console.log(`Server listening on the http://${config.api.host}:${config.api.port}`);
   console.log(`Running in mode ${process.env.NODE_ENV}`);
});
