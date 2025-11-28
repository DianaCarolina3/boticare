import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import router from './routes.js';
import morgan from 'morgan';
import { config } from './core/config/config.js';
import { handlerError } from './shared/response/ApiResponse.js';
import { connectDatabase } from './core/config/database.js';
import pkg from '../package.json' with { type: 'json' };

const app = express();

app.use(express.json());
app.disable('x-powered-by');
app.use(morgan('dev'));
app.set('pkg', pkg);

app.use('/', router);

app.get('/', (_req: Request, res: Response) => {
   res.status(200).json({
      name: app.get('pkg').name,
      author: app.get('pkg').author,
      description: app.get('pkg').description,
      version: app.get('pkg').version,
   });
});

// Si una ruta no existe devuelve message
app.use((_req: Request, res: Response, _next: NextFunction) => {
   res.status(404).json({
      message: 'Not Found',
   });
});

app.use(handlerError);
connectDatabase();

app.listen(config.api.port, (): void => {
   console.log(`Server listening on the http://${config.api.host}:${config.api.port}`);
   console.log(`Running in mode ${process.env.NODE_ENV}`);
});
