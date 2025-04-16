const { Router, application } = require('express');
const itemsController = require('../controllers/itemsController');

const itemsRouter = Router();

itemsRouter.get('/create', itemsController.createItemGet);
itemsRouter.post('/create', itemsController.createItemPost);

module.exports = itemsRouter;
