const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { NotFoundError } = require('../error');
const { getMessages, getUserMessages, userExists } = require('../db');

const messagesRouter = Router();

messagesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const messages = getMessages();
    res.render('pages/messages', { messages });
  })
);

messagesRouter.get(
  '/:userId',
  asyncHandler(async (req, res) => {
    let { userId } = req.params;
    userId = Number(userId);

    if (!userExists(userId)) {
      throw new NotFoundError('User not found');
    }

    const userMessages = getUserMessages(userId);
    res.status(200).render('pages/messages', { messages: userMessages });
  })
);

module.exports = messagesRouter;
