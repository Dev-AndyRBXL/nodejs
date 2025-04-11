const { Router } = require('express');
const { NotFoundError } = require('../error');
const { getMessages, getUserMessages, userExists } = require('../db');

const messagesRouter = Router();

messagesRouter.get('/', (req, res) => {
  res.render('pages/messages', { messages: getMessages() });
});

messagesRouter.get('/:userId', (req, res, next) => {
  const { userId } = req.params;

  try {
    if (!userExists(userId)) {
      throw new NotFoundError('User not found');
    }

    const userMessages = getUserMessages(userId);
    res.status(200).render('pages/messages', { messages: userMessages });
  } catch (err) {
    next(err);
  }
});

module.exports = messagesRouter;
