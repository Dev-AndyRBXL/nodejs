const { Router } = require('express');
const { getUsers } = require('../db');

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  try {
    const usersMap = getUsers();
    if (!usersMap) {
      throw new Error('*Users Data* does not exist!');
    }

    const users = Array.from(usersMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    }));

    res.render('pages/users', { users });
  } catch (err) {
    console.error(`Error: ${err}`);
    next(err);
  }
});

module.exports = usersRouter;
