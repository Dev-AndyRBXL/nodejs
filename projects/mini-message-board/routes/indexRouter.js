const { Router } = require('express');
const { links } = require('../db');

const indexRouter = Router();

indexRouter.get('/', (req, res) => {
  res.render('index', { links });
});

module.exports = indexRouter;
