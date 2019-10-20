import * as Yup from 'yup';
import Checkin from '../models/Checkin';

class CheckinController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        student_id: Yup.integer().required(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados!');
      }

      const { student_id } = request.body;

      const checkin = Checkin.findAndCountAll({
        where: {
          student_id,
        },
        include: [student_id],
        distinct: true,
      });

      return response.json(plan);
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default new CheckinController();
