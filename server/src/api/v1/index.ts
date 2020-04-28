export {};
const express = require('express');
const controller = require('../../controllers');
const { createValidator } = require('express-joi-validation');
const {
  logInSchema,
  getUserSchema,
  getUserFriendsListSchema,
  getUserChallengesSchema,
  getChallengeSchema,
  createUserSchema,
  createPendingFriendshipSchema,
  createChallengeSchema,
  editChallengeSchema,
  getChallengeParticipantsSchema
} = require('./validators');

const router = express.Router();
const validator = createValidator();

// TODO openApi documentation
router.post(
  '/login',
  validator.body(logInSchema.bodySchema),
  controller.logIn
);

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

router.get(
  '/users/:id/challenges',
  validator.params(getUserChallengesSchema.paramsSchema),
  controller.getUserChallenges,
);

router.post(
  '/friendships/user/:id/pending',
  validator.params(createPendingFriendshipSchema.paramsSchema),
  validator.body(createPendingFriendshipSchema.bodySchema),
  controller.createPendingFriendship
);

router.get(
  '/challenges/:id',
  validator.params(getChallengeSchema.paramsSchema),
  controller.getChallenge,
);

router.post(
  '/challenges',
  validator.body(createChallengeSchema.bodySchema),
  controller.createChallenge,
);

router.patch(
  '/challenges/:id',
  validator.params(editChallengeSchema.paramsSchema),
  validator.body(editChallengeSchema.bodySchema),
  controller.editChallenge,
);

//
router.get(
  '/challenges/:id/participants',
  validator.params(getChallengeParticipantsSchema.paramsSchema),
  controller.getChallengeParticipants,
);


module.exports = router;
