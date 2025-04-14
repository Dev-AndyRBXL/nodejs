const { Router } = require('express');
const usersController = require('../controllers/usersController');
const usersRouter = Router();

// search / create
usersRouter.get('/', usersController.usersListGet);
usersRouter.get('/search', usersController.usersListGetByKeyword);
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.post('/create', usersController.usersCreatePost);

// update / delete
usersRouter.get('/:id/update', usersController.usersUpdateGet);
usersRouter.post('/:id/update', usersController.usersUpdatePost);
usersRouter.post('/:id/delete', usersController.usersDeletePost);

module.exports = usersRouter;
