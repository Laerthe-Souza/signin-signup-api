import { Router, Request, Response } from 'express';
import path from 'path';

const pagesRoutes = Router();

pagesRoutes.get('/', async (request: Request, response: Response) => {
  response.render(path.resolve(__dirname, '../', 'views', 'signin'));
});

pagesRoutes.get('/signup', async (request: Request, response: Response) => {
  response.render(path.resolve(__dirname, '../', 'views', 'signup'));
});

pagesRoutes.get('/home', async (request: Request, response: Response) => {
  response.render(path.resolve(__dirname, '../', 'views', 'home'));
});

export default pagesRoutes;
