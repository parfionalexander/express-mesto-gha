const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const { getJwtToken } = require('../utils/auth');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const ValidationError = require('../errors/ValidationError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const UserSameError = require('../errors/UserSameError');
const PageNotFoundError = require('../errors/PageNotFoundError');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => UserModel.find()
  .then((users) => res.status(STATUS_OK).send(users))
  .catch((err) => next(err));

const getUser = (req, res, next) => {
  UserModel.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new PageNotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new PageNotFoundError('Запрашиваемый пользователь не найден'));
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Email или пароль не могут быть пустыми'));
  }

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.status(STATUS_CREATED).send(data))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new UserSameError('Такой пользователь уже существует'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Email или пароль не могут быть пустыми'));
  }
  return UserModel.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        return next(new UserNotFoundError('Такого пользователя не сущестует'));
      }
      return bcrypt.compare(password, admin.password, (err, isValidPassword) => {
        if (!isValidPassword) {
          return next(new UnAuthorizedError('Пароль не верный'));
        }
        const token = getJwtToken({ _id: admin._id });
        return res.status(STATUS_OK).send({ token });
      });
    })
    .catch((err) => next(err));
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getUsers,
  getUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
