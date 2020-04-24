'use strict';
const { ChallengeStatus, Exercise, ExerciseMetric } = require("../../lib/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Challenges', {
        id: {
          type: Sequelize.DataTypes.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        exercise: {
          type: Sequelize.DataTypes.ENUM(Object.values(Exercise)),
          allowNull: false,
        },
        metric: {
          type: Sequelize.DataTypes.ENUM(Object.values(ExerciseMetric)),
          allowNull: false,
        },
        status: {
          type: Sequelize.DataTypes.ENUM(Object.values(ChallengeStatus)),
          allowNull: false,
          defaultValue: ChallengeStatus.HAVE_NOT_STARTED,
        },
        start_time: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
        },
        end_time: {
          type: Sequelize.DataTypes.DATE,
          allowNull: false,
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
    return queryInterface.dropTable('Challenges');
  }
};
