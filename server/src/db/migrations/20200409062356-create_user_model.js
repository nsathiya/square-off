'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.DataTypes.UUID
        },
        first_name: {
          type: Sequelize.DataTypes.STRING
        },
        last_name: {
          type: Sequelize.DataTypes.STRING
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone_number: {
          type: Sequelize.STRING,
          allowNull: false
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
      return queryInterface.dropTable('Users');
  }
};
