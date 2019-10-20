import User from '../models/User';

class BaseController {
  async raiseErrorUserNotIsAdmin(userId) {
    const userAdmin = User.findOne({
      id: userId,
      admin: true,
    });

    if (!userAdmin) {
      Error('Usuário não é um administrador!');
    }
  }
}

export default BaseController();
