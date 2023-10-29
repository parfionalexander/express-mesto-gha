const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnAuthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
