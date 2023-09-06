const { HTTP_STATUS_CREATED, HTTP_STATUS_OK } = require('http2').constants;
const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user)) // status = 201
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(HTTP_STATUS_OK).send(user)) // status = 200
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => { res.status(HTTP_STATUS_OK).send(user); }) // status = 200
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.CastError:
          next(new BadRequestError(`Некорректный id: ${req.params.userId}`));
          break;
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError(`Пользователь с данным id: ${req.params.userId} - не найден`));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Пользователя с данным id не найден' });
      // } else if (err.name === 'CastError') {
      //   res.status(400).send({ message: 'Некорректный id' });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};

module.exports.editUserData = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true }) // new - для возврата обновленных данных, runValidators - для валидации полей
    .orFail()
    .then((user) => { res.status(HTTP_STATUS_OK).send(user); }) // status = 200
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError('Пользователь с данным id - не найден'));
          break;
        case mongoose.Error.ValidationError:
          next(new BadRequestError(err.message));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Пользователя с данным id не найден' });
      // } else if (err.name === 'ValidationError') {
      //   res.status(400).send({ message: err.message });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => { res.status(HTTP_STATUS_OK).send(user); }) // status = 200
    .catch((err) => {
      switch (err.constructor) {
        case mongoose.Error.DocumentNotFoundError:
          next(new NotFoundError('Пользователь с данным id - не найден'));
          break;
        case mongoose.Error.ValidationError:
          next(new BadRequestError(err.message));
          break;
        default:
          next(err);
          break;
      }
      // if (err.message === 'NotFoundId') {
      //   res.status(404).send({ message: 'Пользователя с данным id не найден' });
      // } else if (err.name === 'ValidationError') {
      //   res.status(400).send({ message: err.message });
      // } else {
      //   res.status(500).send({ message: 'Ошибка на сервере' });
      // }
    });
};
