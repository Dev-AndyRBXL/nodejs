// controllers/usersController.js
const usersStorage = require('../storages/usersStorage');
const { body, validationResult } = require('express-validator');

// Error messages
const alphaErr = 'must only contain letters.';
const lengthErr = 'must be between 1 and 10 characters.';
const emailErr = 'must be a valid email!';
const ageErr = 'must be between 18 and 120!';
const bioErr = 'must be between 3 and 200 characters long!';

// Validation middleware
const validateUser = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body('lastName')
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage(`Email ${emailErr}`)
    .custom(async (val) => {
      try {
        const users = await usersStorage.getUsers(val);
        if (users.length > 0) {
          return Promise.reject('E-mail already in use');
        }
      } catch (err) {
        console.error(err);
      }
    }),
  body('age')
    .optional({ values: 'falsy' })
    .isInt({ min: 18, max: 120 })
    .withMessage(`Age ${ageErr}`),
  body('bio')
    .optional({ values: 'falsy' })
    .isLength({ min: 3, max: 200 })
    .withMessage(`Bio ${bioErr}`),
];

// List users
exports.usersListGet = async (req, res) => {
  const users = await usersStorage.getUsers();
  res.render('index', {
    title: 'Users list',
    users,
  });
};

exports.usersListGetByKeyword = async (req, res) => {
  const users = await usersStorage.getUsersByKeyword(req.query.keyword);
  res.render('index', {
    title: 'Users list',
    users,
  });
};

// Show create user form
exports.usersCreateGet = (req, res) => {
  res.render('createUser', {
    title: 'Create user',
  });
};

// Handle user creation
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('createUser', {
        title: 'Create user',
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });

    res.redirect('/');
  },
];

// Show update user form
exports.usersUpdateGet = async (req, res) => {
  const user = await usersStorage.getUserById(req.params.id);
  res.render('updateUser', {
    title: 'Update user',
    user: user,
  });
};

// Handle user update
exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUserById(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('updateUser', {
        title: 'Update user',
        user: user,
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUserById(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });

    res.redirect('/');
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect('/');
};
