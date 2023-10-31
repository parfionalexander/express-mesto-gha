const { ValidationError, CastError } = require('mongoose').Error;
const PageNotFoundError = require('../errors/PageNotFoundError');
const NoRightsError = require('../errors/NoRightsError');
const BadRequestError = require('../errors/BadRequestError');
const CardModel = require('../models/card');

const STATUS_OK = 200;
const STATUS_CREATED = 201;

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: req.user._id })
    .then((data) => res.status(STATUS_CREATED).send(data))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
        return next(new NoRightsError('Нет прав для удаления карточки другого пользователя'));
      }
      return CardModel.deleteOne(deletedCard._id)
        .then(() => res.status(STATUS_OK).send({ message: 'Карточка удалена' }))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
      if (err instanceof CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
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
