import * as Yup from 'yup';
import User from '../models/User';

class SessionController extends BaseController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .min(8)
          .required(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dados');
      }

      const { email, password } = request.body;

      const user = await User.findOne({ email });

      if (!user) {
        Error('Não existe um usuário com o email informado!');
      }

      if (!(await user.checkPassword(password))) {
        Error('Senha inválida!');
      }

      const { id, name } = user;

      return response.json({
        user: {
          id,
          name,
          email,
        },
      });
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default new SessionController();
