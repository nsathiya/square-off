const repository = require('../db/models/repository');
const db = require('../db/models');

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
    const userId = req.body.user_id;
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const email = req.body.email;
    const phoneNumber = req.body.phone_number;

    const user = await db.User.createUser({
      userId,
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
