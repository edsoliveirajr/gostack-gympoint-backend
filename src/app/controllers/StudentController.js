import * as Yup from 'yup';
import Student from '../models/Student';
import BaseController from './BaseController';

class StudentController extends BaseController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        age: Yup.number()
          .min(1)
          .integer(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados!');
      }

      await raiseErrorUserNotIsAdmin(request.userId);

      const { name, email, age, weight, height } = request.body;

      const student = await Student.create({
        name,
        email,
        age,
        weight,
        height,
      });

      return response.json({ student });
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default new StudentController();
