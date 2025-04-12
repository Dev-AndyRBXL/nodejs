const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { getUsers, getUser, userExists } = require('../db');
const { NotFoundError } = require('../error');

const usersRouter = Router();

usersRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const usersMap = getUsers();

    if (!usersMap) {
      throw new Error('*Users Data* does not exist!');
    }

    const users = Array.from(usersMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    }));

    res.render('pages/users', { users });
  })
);

usersRouter.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    let { userId } = req.params;
    userId = Number(userId);

    if (!userExists(userId)) {
      throw new NotFoundError('User not found');
    }

    const user = getUser(userId);
    res.render('pages/users', { users: [user] }); 
  })
);


module.exports = usersRouter;
