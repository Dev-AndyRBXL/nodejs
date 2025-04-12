const express = require('express');
const app = express();
const path = require('node:path');
const indexRouter = require('./routes/indexRouter');
const messagesRouter = require('./routes/messagesRouter');
const usersRouter = require('./routes/usersRouter');
const { NotFoundError, BadRequestError } = require('./error');

app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/messages', messagesRouter);
app.use('/users', usersRouter);

app.use((err, req, res, next) => {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).json({ error: err.message });
  } else if (err instanceof BadRequestError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error!' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
