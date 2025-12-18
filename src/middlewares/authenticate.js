import createHttpError from 'http-errors';
import Session from '../db/models/Session.js';
import User from '../db/models/User.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(createHttpError(401));

  const [, token] = authHeader.split(' ');

  const session = await Session.findOne({ accessToken: token });
  if (!session) return next(createHttpError(401));

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  req.user = await User.findById(session.userId);
  next();
};
