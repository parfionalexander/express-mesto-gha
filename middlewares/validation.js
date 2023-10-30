/* eslint-disable no-useless-escape */
const { celebrate, Joi } = require('celebrate');

const URL = /https?\:\/\/[a-zA-Z0-9]+\.[a-z]*[\/a-zA-z0-9]*\S*/;

module.exports = {
  loginValidation: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUserValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(URL),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  getUserByIdValidation: celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),
  upgradeUserInfoValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  upgradeUserAvatarValidation: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(URL),
    }),
  }),
  createCardValidation: celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(URL),
    }),
  }),
  deleteCardValidation: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).required(),
    }),
  }),
  likeCardValidation: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCardValidation: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
};
