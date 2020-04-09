import * as Sequelize from 'sequelize';
import { initUser } from './user';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config.json')[env];


const sequelize = new Sequelize(config.url, config);

const db = {
  sequelize,
  Sequelize,
  User: initUser(sequelize),
}

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
// module.exports = db;
