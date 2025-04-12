const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { NotFoundError, BadRequestError } = require('../error'); // Assuming error definitions exist
const {
  // Import necessary functions from db.js
  getMessages,
  getUserMessages,
  findUserByName, // <-- Import findUserByName
  addUser, // <-- Import addUser
  addMessage,
} = require('../db'); // Assuming db.js is in ../db

const messagesRouter = Router();

// GET all messages - NO CHANGE
messagesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const messages = getMessages();
    res.render('pages/messages', { messages });
  })
);

// GET messages for a specific user - NO CHANGE (still uses ID in URL)
messagesRouter.get(
  '/:userId',
  asyncHandler(async (req, res, next) => {
    // Added next for potential errors
    let { userId } = req.params;
    userId = Number(userId);

    // We still need userExists for this route based on ID
    const { userExists } = require('../db'); // Import locally if not already imported globally

    if (isNaN(userId) || !(userExists(userId))) {
      // Keep userExists check async if it might become async later
      throw new NotFoundError('User not found');
    }

    const userMessages = getUserMessages(userId);
    res.status(200).render('pages/messages', { messages: userMessages });
  })
);

// POST a new message - UPDATED LOGIC
messagesRouter.post(
  '/new',
  asyncHandler(async (req, res) => {
    // 1. Get username (author) and message text from body
    const { author, msg } = req.body;
    const authorName = author?.trim();
    const messageText = msg?.trim();

    // 2. Validate input
    if (!authorName || !messageText) {
      throw new BadRequestError('Author and message cannot be empty.');
    }

    // 3. Find user by name (case-insensitive via normalization in db function)
    let userId = findUserByName(authorName); // Use await if db functions could become async

    // 4. If user not found, create a new user
    if (userId === null) {
      try {
        console.log(`User '${authorName}' not found, attempting to add.`);
        userId = addUser(authorName); // addUser handles normalization and returns ID
      } catch (error) {
        // Handle potential errors from addUser (e.g., invalid name format if stricter rules applied)
        // For now, assume BadRequestError is suitable, or re-throw for generic handler
        console.error(`Error adding user '${authorName}':`, error);
        throw new BadRequestError(`Could not add user: ${error.message}`);
      }
    } else {
      console.log(`User '${authorName}' found with ID: ${userId}`);
    }

    // 5. Add the message using the found or newly created userId
    if (userId) {
      // Ensure we have a valid userId
      await addMessage(messageText, userId); // addMessage handles getting author name from ID
      res.redirect('/messages'); // Redirect to messages page is more intuitive
    } else {
      // This case should theoretically not be reached if addUser succeeds or findUserByName finds one
      throw new Error('Failed to obtain a valid user ID.');
    }
  })
);

module.exports = messagesRouter;
