'use strict';
const { Exercise, DistanceMetric } = require("../../lib/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Activities', {
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      distance: {
        type: Sequelize.FLOAT,
      },
      distanceMetric: {
        type: Sequelize.DataTypes.ENUM(Object.values(DistanceMetric)),
      },
      time: {
        type: Sequelize.FLOAT,
      },
      caloriesBurned: {
        type: Sequelize.FLOAT,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      exercise: {
        type: Sequelize.DataTypes.ENUM(Object.values(Exercise)),
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
      userId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Activities');
  }
};
