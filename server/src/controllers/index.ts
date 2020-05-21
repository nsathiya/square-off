import {
  getUserFriendsList,
  getUserChallenges,
  getUserActivities,
  getChallengeDetails
} from '../db/models/repository';
const db = require('../db/models');
const { FriendStatus } = require('../lib/constants');
import{ updateScore } from '../services/ScoreCalculator';

module.exports.logIn = async (req, res, next) => {
  try {
    const username: string = req.body.username;

    const user = await db.User.getUserByUsername(username);

    res.status(200).send({ message: user });
  } catch (e) {
    console.error('getUser request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

// TODO move to users.js
module.exports.getUser = async (req, res, next) => {
  try {
    const id = req.query.id;

    const user = await db.User.getUserById(id);

    res.status(200).send({ message: user });
  } catch (e) {
    console.error('getUser request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {

    const users = await db.User.getAllUsers();

    res.status(200).send({ message: users });
  } catch (e) {
    console.error('getAllUsers request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const username = req.body.username;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const phoneNumber = req.body.phone_number;

    const user = await db.User.createUser({
      username,
      firstName,
      lastName,
      email,
      phoneNumber
    });

    res.status(200).send({ message: user });
  } catch (e) {
    console.error('createUser request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getUserFriendsList = async (req, res, next) => {
  try {

    const id = req.params.id;

    const friends = await getUserFriendsList(id);

    res.status(200).send({ message: friends });
  } catch (e) {
    console.error('getUserFriendsList request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getUserChallenges = async (req, res, next) => {
  try {

    const userId = req.params.id;

    const challenges = await getUserChallenges(userId);

    res.status(200).send({ message: challenges });
  } catch (e) {
    console.error('getUserChallenges request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getUserActivities = async (req, res, next) => {
  try {

    const userId = req.params.id;

    const activities = await getUserActivities(userId);

    res.status(200).send({ message: activities });
  } catch (e) {
    console.error('getUserActivities request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

// TODO move to friedships.js
module.exports.createPendingFriendship = async (req, res, next) => {
  try {

    const user = req.params.id;
    const friendId = req.body.friendId;

    const friendship = await db.Friendship.createFriendship({
      user,
      friend: friendId,
      status: FriendStatus.PENDING,
    });
    const friend = await db.User.getUserById(friendId);

    res.status(200).send({ message: { friendship, friend } });
  } catch (e) {
    console.error('createPendingFriendship request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getChallenge = async (req, res, next) => {
  try {

    const challengeId = req.params.id;

    const challenge = await db.Challenge.getById(challengeId);

    res.status(200).send({ message: challenge });
  } catch (e) {
    console.error('getChallenge request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getChallengeParticipants = async (req, res, next) => {
  try {

    const challengeId = req.params.id;

    const { participants } = await getChallengeDetails(challengeId);
    res.status(200).send({ message: participants });
  } catch (e) {
    console.error('getChallengeParticipants request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getChallengeScorecards = async (req, res, next) => {
  try {

    const challengeId = req.params.id;

    const { scorecards } = await getChallengeDetails(challengeId);
    res.status(200).send({ message: scorecards });
  } catch (e) {
    console.error('getChallengeScorecards request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getChallengeActivities = async (req, res, next) => {
  try {

    const challengeId = req.params.id;

    const { activities } = await getChallengeDetails(challengeId);
    res.status(200).send({ message: activities });
  } catch (e) {
    console.error('getChallengeActivities request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.createChallenge = async (req, res, next) => {
  try {
    const { participants, ...challengeBody } = req.body;
    const challengeDb = await db.Challenge.createChallenge(challengeBody);
    // TODO Find out why.. wierd bug
    const challenge =  challengeDb.get();
    if (participants && challenge) {
      const scorecards = participants.map((userId: string) => ({ userId, challengeId: challenge.id }));
      const scorecardsDb = await db.Scorecard.createScorecards(scorecards);
      challenge.participants = scorecardsDb.map(scorecard => scorecard.userId);
    }
    res.status(200).send({ message: challenge });
  } catch (e) {
    console.error('createChallenge request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.createActivity = async (req, res, next) => {
  try {
    const activityBody = req.body;
    console.log('activityBody', activityBody);
    const activity = await db.Activity.createActivity(activityBody);
    await updateScore(activity);

    res.status(200).send({ message: activity });
  } catch (e) {
    console.error('createChallenge request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.editChallenge = async (req, res, next) => {
  try {
    const challengeId = req.params.id;
    const challengeBody = req.body;

    const challenge = await db.Challenge.editChallenge(challengeId, challengeBody);
    res.status(200).send({ message: challenge });
  } catch (e) {
    console.error('editChallenge request error: ', e);
    res.status(500).send({ error: e.message });
  }
};
