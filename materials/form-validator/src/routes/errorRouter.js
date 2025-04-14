const express = require('express');
const errRouter = express.Router();

errRouter.use((req, res, next) => {
  res.status(404).json({
    error: true,
    message: 'Route not found',
  });
});

errRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = errRouter;
