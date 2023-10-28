/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/handleError');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  autoIndex: true,
});

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?\:\/\/[a-zA-Z0-9]+\.[a-z]+[\/a-zA-z0-9]+\S+/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });

  next();
});

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
