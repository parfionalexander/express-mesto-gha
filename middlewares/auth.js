const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      return next(new UnAuthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new UnAuthorizedError('Необходима авторизация'));
    }
  }

  req.user = payload;
  return next();
};

module.exports = auth;
