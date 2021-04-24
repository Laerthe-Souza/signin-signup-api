import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';

import routes from './routes';
import AppError from './errors/AppError';

import './database/connection';

const app = express();

app.use(express.json());
app.set('view engine', 'ejs');
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err.message);

  return response.status(500).json({
    status: 'error',
    message: 'Erro interno no servidor',
  });
});

app.listen(3333, () => console.log('Server is running on port 3333'));
