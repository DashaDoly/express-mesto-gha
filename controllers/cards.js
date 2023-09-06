const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data)) // 201
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
      // if (err.name === 'ValidationError') {
      //   res.status(400).send({ message: err.message });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards)) // 200
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then(() => { res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' }); })
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError('Карточка с данным id не найдена'));
          break;
        case mongoose.Error.CastError:
          next(new BadRequestError('Некорректный id карточки'));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Карточка с данным id не найдена' });
      // } else if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Некорректный id карточки' });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => { res.status(HTTP_STATUS_OK).send(card); })
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError('Карточка с данным id не найдена'));
          break;
        case mongoose.Error.CastError:
          next(new BadRequestError('Некорректный id карточки'));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Карточка с данным id не найдена' });
      // } else if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Некорректный id карточки' });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .orFail()
    .then((card) => { res.status(HTTP_STATUS_OK).send(card); })
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError('Карточка с данным id не найдена'));
          break;
        case mongoose.Error.CastError:
          next(new BadRequestError('Некорректный id карточки'));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Карточка с данным id не найдена' });
      // } else if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Некорректный id карточки' });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};
