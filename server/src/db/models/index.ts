import * as Sequelize from 'sequelize';
import { initUser } from './user';
import { initFriendship } from './friendship';
import { initChallenge } from './challenge';
import { initScorecard } from './scorecard';
import { initActivity } from './activity';
import { initActivityIndicator } from './activityIndicator';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.js')[env];


const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
    dialectOptions: {
      useUTC: false,
      dateStrings: true,
    },
  }
);

const db: any = {
  sequelize,
  Sequelize,
  User: initUser(sequelize),
  Friendship: initFriendship(sequelize),
  Challenge: initChallenge(sequelize),
  Scorecard: initScorecard(sequelize),
  Activity: initActivity(sequelize),
  ActivityIndicator: initActivityIndicator(sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
