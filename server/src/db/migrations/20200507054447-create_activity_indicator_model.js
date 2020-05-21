'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ActivityIndicators', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      activityId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Activities',
          key: 'id'
        }
      },
      challengeId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Challenges',
          key: 'id'
        }
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
    return queryInterface.dropTable('ActivityIndicators');
  }
};
