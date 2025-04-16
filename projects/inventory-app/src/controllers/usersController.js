const { body, validationResult } = require('express-validator');
const expressAsyncHandler = require('express-async-handler');
const db = require('../db');

// Validation rules
const alphaErr = 'must only contain letters!';
const emailErr = 'must be a valid email address!';
const phoneErr = 'must be a valid phone number!';
const urlErr = 'must be a valid URL!';
const ratingErr = 'must be a number between 0 and 5!';
const dateErr = 'must be a valid ISO 8601 date!';

const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Name must be between 1 and 50 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .withMessage(emailErr),

  body('password_hash').trim().notEmpty().withMessage('Password is required'),

  body('address')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Address must be between 3 and 100 characters'),

  body('city')
    .trim()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage(`City ${alphaErr}`),

  body('rating').isFloat({ min: 0, max: 5 }).withMessage(ratingErr),
];

exports.getUsers = expressAsyncHandler(async (req, res) => {
  console.log('➡️ getUsers route hit');

  const users = await db.getUsers();
  const items = await db.getItems();

  res.render('index', {
    title: 'Inventory Application',
    users,
    items,
  });
});

exports.getUserById = expressAsyncHandler(async (req, res) => {
  const user = await db.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

exports.getUsersByKeyword = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.keyword;

  const users = await db.getUsersByKeyword(keyword);
  const items = await db.getItems();

  res.render('index', {
    title: 'Inventory Application',
    users,
    items,
  });
});

exports.usersCreateGet = expressAsyncHandler(async (req, res) => {
  res.render('pages/createUser', {
    title: 'Create User',
    errors: [],
    userData: {},
  });
});

exports.usersCreatePost = [
  validateUser,
  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('pages/createUser', {
        title: 'Create User',
        errors: errors.array(),
        userData: req.body,
      });
    }

    const {
      name,
      email,
      password_hash,
      phone,
      profile_picture_url,
      address,
      city,
      rating,
    } = req.body;

    await db.addUser({
      name,
      email,
      password_hash,
      phone,
      profile_picture_url,
      address,
      city,
      rating: Number(rating),
      joined_at: new Date().toISOString(),
    });

    res.redirect('/users');
  }),
];
