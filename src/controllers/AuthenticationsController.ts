import { Request, Response } from 'express';

import CreateAuthenticationService from '../services/CreateAuthenticationService';

class AuthenticationsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createAuthentication = new CreateAuthenticationService();

    const user = await createAuthentication.execute({ email, password });

    return response.status(201).json(user.name);
  }
}

export default AuthenticationsController;
