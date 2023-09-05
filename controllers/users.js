const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFoundId'))
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        res.status(404).send({ message: 'Пользователя с данным id не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true }) // new - для возврата обновленных данных, runValidators - для валидации полей
    .orFail(new Error('NotFoundId'))
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        res.status(404).send({ message: 'Пользователя с данным id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true', runValidators: true })
    .orFail(new Error('NotFoundId'))
    .then((user) => { res.send(user); })
    .catch((err) => {
      if (err.message === 'NotFoundId') {
        res.status(404).send({ message: 'Пользователя с данным id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};
