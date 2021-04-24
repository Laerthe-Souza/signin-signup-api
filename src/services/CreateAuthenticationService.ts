import { getRepository } from 'typeorm';
import { compare } from 'bcrypt';
import * as Yup from 'yup';

import User from '../models/User';
import AppError from '../errors/AppError';

interface SignInData {
  email: string;
  password: string;
}

class CreateAuthenticationService {
  public async execute({ email, password }: SignInData): Promise<User> {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email('Insira um formato de e-mail válido')
        .required('O e-mail é obrigatório'),
      password: Yup.string().test('text-name', '', function (value = '') {
        const { createError, path } = this;

        if (!value) {
          return createError({ path, message: 'A senha é obrigatória' });
        }

        if (/\s/g.test(value)) {
          return createError({
            path,
            message: 'Senha: Não são permitidos espaços em brancos!',
          });
        }

        if (value.length < 8) {
          return createError({
            path,
            message: 'Senha: Digite no mínimo 8 caracteres',
          });
        }

        return true;
      }),
    });

    await schema
      .validate({ email, password }, { abortEarly: false })
      .catch(err => {
        throw new AppError(err.errors[0]);
      });

    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Credenciais incorretas');
    }

    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      throw new AppError('Credenciais incorretas');
    }

    return user;
  }
}

export default CreateAuthenticationService;
