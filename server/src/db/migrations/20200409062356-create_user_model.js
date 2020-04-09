'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.DataTypes.INTEGER
        },
        first_name: {
          type: Sequelize.DataTypes.STRING
        },
        last_name: {
          type: Sequelize.DataTypes.STRING
        },
        bio: {
          type: Sequelize.DataTypes.TEXT
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE
        }
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
  }
};
