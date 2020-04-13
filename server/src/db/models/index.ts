import * as Sequelize from 'sequelize';
import { initUser } from './user';
import { initFriendship } from './friendship';

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
  }
);

interface dbObject {
  sequelize: any,
  Sequelize: any,
  User: any,
  Friendship: any,
}

const db:any = {
  sequelize,
  Sequelize,
  User: initUser(sequelize),
  Friendship: initFriendship(sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
