import { Router } from 'express';

import pagesRoutes from './pages.routes';
import usersRoutes from './users.routes';
import authenticationsRoutes from './authentication.routes';

const routes = Router();

routes.use('/', pagesRoutes);
routes.use('/users', usersRoutes);
routes.use('/authentication', authenticationsRoutes);

export default routes;
