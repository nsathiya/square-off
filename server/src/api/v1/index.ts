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
  '/users/:id',
  validator.query(getUserSchema.querySchema),
  controller.getUser
);
// router.get('/users', controller.getAllUsers);
// router.get('/users/:id/friendships', controller.getUserFriendships)
router.post(
  '/users',
  validator.query(createUserSchema.bodySchema),
  controller.createUser
);

module.exports = router;

// router.post('/friendships', controller.createFriendship);
