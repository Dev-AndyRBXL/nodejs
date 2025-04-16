const express = require('express');
const app = express();
const path = require('node:path');
const userRouter = require('./src/routes/usersRouter');
const itemsRouter = require('./src/routes/itemsRouter');

require('ejs');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.redirect('/users');
});
app.use('/users', userRouter);
app.use('/items', itemsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('App listening on port:', port);
});
