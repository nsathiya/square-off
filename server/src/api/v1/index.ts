export {};
const express = require('express');
const controller = require('../../controllers');
const { createValidator } = require('express-joi-validation');
const {
  getUserSchema,
  createUserSchema,
} = require('./validators');

const router = express.Router();
const validator = createValidator();

router.get(
  '/user/:id',
  validator.query(getUserSchema.querySchema),
  controller.getUser
);
// router.get('/user', controller.getAllUsers);
// router.get('/user/:id/friendship', controller.getUserFriendships)
router.post(
  '/user',
  validator.query(createUserSchema.bodySchema),
  controller.createUser
);

module.exports = router;

// router.post('/friendship', controller.createFriendship);
