const mongoose = require('mongoose');

// описываем схему
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальное количество символов 2'],
    maxlength: [30, 'Максимальное количество символов 30'],
  },
  about: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальное количество символов 2'],
    maxlength: [30, 'Максимальное количество символов 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate: {
      validator(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
      },
      message: 'Некорректный URL',
    },
  },
}, { versionKey: false });

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
