import { Router } from 'express';

import AuthenticationsController from '../controllers/AuthenticationsController';

const authenticationsRoutes = Router();

const authenticationsController = new AuthenticationsController();

authenticationsRoutes.post('/', authenticationsController.create);

export default authenticationsRoutes;
