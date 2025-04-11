// authorController.js
const db = require('./db.js');
const asyncHandler = require("express-async-handler");
const CustomNotFoundError = require('./customNotFoundError.js');

const getAuthorById = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    throw new CustomNotFoundError('Author not found');
  }

  res.send(`Author Name: ${author.name}`);
});

module.exports = { getAuthorById };
