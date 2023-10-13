const UserModel = require('../models/user');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  UserModel.create({ name, about, avatar })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const getUsers = (req, res) => {
  UserModel.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
};
