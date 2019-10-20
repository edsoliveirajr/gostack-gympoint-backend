import jwt from 'jsonwebtoken';
import promisify from 'util';

import authConfig from '../../config/auth';

export default async (request, response, next) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      Error('Token not provided');
    }

    const [, token] = authHeader.split(' ');

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    request.userId = decoded.id;

    return next();
  } catch (error) {
    return response.status(401).json(error);
  }
};
