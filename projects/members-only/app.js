const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
const path = require('node:path');
require('dotenv').config();

const pool = require('./src/config/db');
require('./src/config/passport')(passport);
const errors = require('./src/errors');

const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000, secure: false, httpOnly: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', require('./src/routes/index'));
app.use('/', require('./src/routes/auth'));

app.use((err, req, res, next) => {
  if (err instanceof errors.NotFoundError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof errors.ValidationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof errors.UnauthorizedError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof errors.ForbiddenError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof errors.ConflictError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 1100;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
