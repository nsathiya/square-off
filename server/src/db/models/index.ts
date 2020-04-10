import * as Sequelize from 'sequelize';
import { initUser } from './user';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.json')[env];


const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect
  }
);

interface dbObject {
  sequelize: any,
  Sequelize: any,
  User: any,
}

const db:any = {
  sequelize,
  Sequelize,
  User: initUser(sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
