const bcrypt = require('bcrypt');
const { ValidationError, CastError } = require('mongoose').Error;
const UserModel = require('../models/user');
const { getJwtToken } = require('../utils/auth');
const UnAuthorizedError = require('../errors/UnAuthorizedError');
const BadRequestError = require('../errors/BadRequestError');
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
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((data) => res.status(STATUS_CREATED).send({
      name: data.name,
      about: data.about,
      avatar: data.avatar,
      email: data.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new UserSameError('Такой пользователь уже существует'));
      }
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return UserModel.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        return next(new UnAuthorizedError('Пароль или почта не верные'));
      }
      return bcrypt.compare(password, admin.password)
        .then((matched) => {
          if (!matched) {
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
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
