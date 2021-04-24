import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';
import * as Yup from 'yup';

import User from '../models/User';
import AppError from '../errors/AppError';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class CreateUserService {
  public async execute({
    name,
    email,
    password,
    confirmPassword,
  }: SignUpData): Promise<User> {
    const schema = Yup.object().shape({
      name: Yup.string().required('O nome é obrigatório'),
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
      confirmPassword: Yup.string().test(
        'text-name',
        '',
        function (value = '') {
          const { createError, path } = this;

          if (value !== password) {
            return createError({
              path,
              message: 'Confirmar senha: As senhas não correspondem',
            });
          }

          return true;
        },
      ),
    });

    await schema
      .validate(
        { name, email, password, confirmPassword },
        { abortEarly: false },
      )
      .catch(err => {
        throw new AppError(err.errors[0]);
      });

    const usersRepository = getRepository(User);

    const userAlreadyExists = await usersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new AppError(
        'Já existe uma usuário com este e-mail, por favor tente outro.',
      );
    }

    const passwordHash = await hash(password, 8);

    const user = usersRepository.create({
      name,
      email,
      password: passwordHash,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
