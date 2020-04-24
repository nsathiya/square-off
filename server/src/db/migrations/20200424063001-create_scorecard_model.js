'use strict';
const { ScorecardStatus } = require("../../lib/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Scorecards', {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        userId: {
          type: Sequelize.DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'Users',
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
        status: {
          type: Sequelize.DataTypes.ENUM(Object.values(ScorecardStatus)),
          allowNull: false,
          defaultValue: ScorecardStatus.ACCEPTED,
        },
        data: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: { activities: {} },
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
    return queryInterface.dropTable('Scorecards');
  }
};
