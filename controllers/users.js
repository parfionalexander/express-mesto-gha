const UserModel = require('../models/user');

const STATUS_OK = 200;
const ERROR_VALIDATION = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_SERVER = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  UserModel.create({ name, about, avatar })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(ERROR_SERVER).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(STATUS_OK).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(ERROR_VALIDATION).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((data) => res.status(STATUS_OK).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(ERROR_VALIDATION).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(ERROR_SERVER).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
