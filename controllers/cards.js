const CardModel = require('../models/card');

const createCard = (req, res) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((data) => res.status(201).send(data))
    .catch((err) => {
      console.log(err);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const getCards = (req, res) => {
  CardModel.find()
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Запрашиваемая карточка отсутствует' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Запрашиваемая карточка отсутствует' });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

const dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Запрашиваемая карточка отсутствует' });
      }
      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Переданы некорректные данные, ${err}` });
      }
      return res.status(500).send({ message: `Ошибка на стороне сервера, ${err}` });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
