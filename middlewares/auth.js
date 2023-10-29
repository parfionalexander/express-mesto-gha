const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'SECRET_KEY' } = process.env;
const UnAuthorizedError = require('../errors/UnAuthorizedError');

const auth = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    if (!token) {
      next(new UnAuthorizedError('Необходима авторизация'));
      return;
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnAuthorizedError('Необходима авторизация'));
      return;
    }
  }

  req.user = payload;
  next();
};

module.exports = auth;
