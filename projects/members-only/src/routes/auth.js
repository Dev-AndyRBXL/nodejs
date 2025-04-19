const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const pool = require('../config/db');
const asyncHandler = require('express-async-handler');

router.get('/sign-up', (req, res) => {
  res.render('templates/sign-up');
});

router.post(
  '/sign-up',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await pool.query(
      'SELECT * FROM test_users WHERE username = $1',
      [username]
    );

    if (existingUser.rows.length) {
      return res.status(400).send('User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO test_users (username, password) VALUES ($1, $2);',
      [username, hashedPassword]
    );

    res.redirect('/');
  })
);

router.get('/log-in', (req, res, next) => {
  res.render('templates/log-in');
})

router.post('/log-in', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send(info.message);

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get(
  '/log-out',
  asyncHandler(async (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect('/');
    });
  })
);

module.exports = router;
