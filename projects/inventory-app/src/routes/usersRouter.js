const { Router } = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/create', usersController.usersCreateGet);
usersRouter.get('/search', usersController.getUsersByKeyword);
usersRouter.get('/:userId', usersController.getUserById); 
usersRouter.post('/create', usersController.usersCreatePost);

module.exports = usersRouter;
