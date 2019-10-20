import * as Yup from 'yup';
import addMonths from 'date-fns/addMonths';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Registration from '../models/Registration';
import BaseController from './BaseController';

class RegistrationController extends BaseController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        student_id: Yup.integer().required(),
        plan_id: Yup.integer().required(),
        start_date: Yup.date().required(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados');
      }

      await raiseErrorUserNotIsAdmin(request.userId);

      const { student_id, plan_id, start_date } = request.body;

      const student = await Student.findOne({
        id: student_id,
      });

      if (!student) {
        Error('Aluno informado não existe!');
      }

      const plan = await Plan.findOne({
        id: plan_id,
      });

      if (!plan) {
        Error('Plano informado não existe!');
      }

      // Calcula a data final somando a quantidade de meses do plano
      const end_date = addMonths(start_date, plan.duration);

      // Calcula o preço total do plano
      const price = plan.price * plan.duration;

      const registration = await Registration.create({
        student_id,
        plan_id,
        start_date,
        end_date,
        price,
      });

      return response.json(registration);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default new RegistrationController();
