import * as Yup from 'yup';
import User from '../models/User';
import BaseController from './BaseController';

class UserController extends BaseController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email,
        password: Yup.string()
          .required()
          .min(6),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados!');
      }

      await raiseErrorUserNotIsAdmin(request.userId);

      const { name, email, password, admin } = request.body;

      if (!(await User.findOne({ email }))) {
        Error('Já existe um usuário com o email informado!');
      }

      const user = await User.create({
        name,
        email,
        password,
        admin,
      });

      response.json({ user });
    } catch (error) {
      response.status(400).json(error);
    }
  }
}

export default new UserController();
