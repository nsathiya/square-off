export {};
const express = require('express');
const controller = require('../../controllers');
const { createValidator } = require('express-joi-validation');
const {
  getUserSchema,
  getUserFriendsListSchema,
  createUserSchema,
  createPendingFriendshipSchema,
} = require('./validators');

const router = express.Router();
const validator = createValidator();

// TODO openApi documentation
router.get(
  '/users/:id',
  validator.params(getUserSchema.paramsSchema),
  controller.getUser
);

router.get(
  '/users',
  controller.getAllUsers
);

router.post(
  '/users',
  validator.body(createUserSchema.bodySchema),
  controller.createUser
);

router.get(
  '/users/:id/friendslist',
  validator.params(getUserFriendsListSchema.paramsSchema),
  controller.getUserFriendsList,
);

router.post(
  '/friendships/user/:id/pending',
  validator.params(createPendingFriendshipSchema.paramsSchema),
  validator.body(createPendingFriendshipSchema.bodySchema),
  controller.createPendingFriendship
);


module.exports = router;
