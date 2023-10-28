const PageNotFoundError = require('../errors/PageNotFoundError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const ValidationError = require('../errors/ValidationError');
const CardModel = require('../models/card');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((data) => res.status(STATUS_CREATED).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const getCards = (req, res, next) => {
  CardModel.find()
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  CardModel.findById(cardId)
    .then((deletedCard) => {
      if (!deletedCard) {
        return next(new PageNotFoundError('Запрашиваемая карточка отсутствует'));
      }
      if (deletedCard.owner.toString() !== req.user._id) {
        return next(new UserNotFoundError('Нет прав для удаления карточки другого пользователя'));
      }
      res.status(STATUS_OK).send({ message: 'Карточка удалена' });
      return CardModel.findByIdAndRemove(cardId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return next(new PageNotFoundError('Запрашиваемая карточка отсутствует'));
      }
      return res.status(STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((data) => {
      if (!data) {
        return next(new PageNotFoundError('Запрашиваемая карточка отсутствует'));
      }
      return res.status(STATUS_OK).send(data);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
