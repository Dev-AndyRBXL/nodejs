// authorRouter.js
const { Router } = require('express');
const { getAuthorById } = require('./authorController.js');

const authorRouter = Router();

// ... other route handlers
authorRouter.get('/:authorId', getAuthorById);

module.exports = authorRouter;
