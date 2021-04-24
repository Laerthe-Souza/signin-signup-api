import { Request, Response } from 'express';

import CreateUserService from '../services/CreateUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, confirmPassword } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
      confirmPassword,
    });

    return response.status(201).json(user.name);
  }
}

export default UsersController;
