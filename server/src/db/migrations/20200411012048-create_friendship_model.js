'use strict';
const { FriendStatus } = require("../../lib/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Friendships', {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        user: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        friend: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        status: {
          type: Sequelize.DataTypes.ENUM(Object.values(FriendStatus)),
          allowNull: false,
          defaultValue: FriendStatus.PENDING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE
        },
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Friendships');
  }
};
