const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '652599a5755895161793e773',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);

app.use('/*', (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена' });

  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
