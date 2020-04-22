import { getUserFriendsList } from '../db/models/repository';
const db = require('../db/models');
const { FriendStatus } = require('../lib/constants');

module.exports.logIn = async (req, res, next) => {
  try {
    const username: string = req.body.username;

    const user = await db.User.getUserByUsername(username);

    res.status(200).send({ message: user });
  } catch (e) {
    console.log('getUser request error: ', e);
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
    console.log('getUser request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {

    const users = await db.User.getAllUsers();

    res.status(200).send({ message: users });
  } catch (e) {
    console.log('getAllUsers request error: ', e);
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
    console.log('createUser request error: ', e);
    res.status(500).send({ error: e.message });
  }
};

module.exports.getUserFriendsList = async (req, res, next) => {
  try {

    const id = req.params.id;

    const friendship = await getUserFriendsList(id);

    res.status(200).send({ message: friendship });
  } catch (e) {
    console.log('getUserFriendsList request error: ', e);
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
    console.log('createPendingFriendship request error: ', e);
    res.status(500).send({ error: e.message });
  }
};
