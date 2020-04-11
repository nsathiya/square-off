const express = require('express');
const routes = express.Router();
const controller = require('./controller');

router.get('/user/:userId', controller.getUser);
router.get('/user', controller.getUsers);
router.get('/user/:userId/friendship', controller.getUserFriendships)
router.post('/user', contoller.createUser);

router.post('/friendship', controller.createFriendship);
