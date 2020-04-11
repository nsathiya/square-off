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
        user_id: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        email: {
          type: Sequelize.DataTypes.STRING,
        },
        phone_number: {
          type: Sequelize.DataTypes.STRING,
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
