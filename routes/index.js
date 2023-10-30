/* eslint-disable no-console */
const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const PageNotFoundError = require('../errors/PageNotFoundError');
const { loginValidation, createUserValidation } = require('../middlewares/validation');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('/*', (req, res, next) => {
  next(new PageNotFoundError('Такой страницы не существует'));

  return next();
});

module.exports = router;
