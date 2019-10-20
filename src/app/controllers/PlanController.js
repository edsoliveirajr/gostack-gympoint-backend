import * as Yup from 'yup';
import Plan from '../models/Plan';
import BaseController from './BaseController';

class PlanController extends BaseController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        duration: Yup.integer().required(),
        price: Yup.number().required(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados');
      }

      await raiseErrorUserNotIsAdmin(request.userId);

      const { title, duration, price } = request.body;

      const planExists = await Plan.findOne({
        title,
      });

      if (planExists) {
        Error('Já existe uma plano com esse nome');
      }

      const plan = await Plan.create({
        title,
        duration,
        price,
      });

      return response.json(plan);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        duration: Yup.integer().required(),
        price: Yup.number().required(),
      });

      if (!(await schema.isValid(request.body))) {
        Error('Erro na validação dos dados');
      }

      await raiseErrorUserNotIsAdmin(request.userId);

      const { id } = request.params;

      const { title } = request.body;

      const plan = await Plan.findByPk({ id });

      if (title !== plan.title) {
        const titlePlanAlreadyExists = Plan.findOne({
          title,
        });

        if (titlePlanAlreadyExists) {
          Error('Já existe um plano com o nome informado!');
        }
      }

      await plan.update(request.body);

      return response.json(plan);
    } catch (error) {
      return response.status(400).json(error);
    }
  }

  async delete(request, response) {
    try {
      await raiseErrorUserNotIsAdmin(request.userId);

      const { id } = request.params;

      await Plan.destroy({ where: { id } });

      return response.json({ message: 'Plano excluído com sucesso!' });
    } catch (error) {
      return response.status(400).json(error);
    }
  }
}

export default new PlanController();
