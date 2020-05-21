import * as Sequelize from 'sequelize';

interface ActivityIndicatorAttributes {
  id?: string;
  activityId: string;
  challengeId: string;
  createdAt?: string;
  updatedAt?: string;
}

type ActivityIndicatorInstance = Sequelize.Instance<ActivityIndicatorAttributes> & ActivityIndicatorAttributes;

export function initActivityIndicator(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ActivityIndicatorAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    activityId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Activities',
        key: 'id'
      }
    },
    challengeId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Challenges',
        key: 'id'
      }
    },
  };
  const ActivityIndicator = sequelize.define<ActivityIndicatorInstance, ActivityIndicatorAttributes>('ActivityIndicators', attributes);

  ActivityIndicator.associate = (models) => {
    ActivityIndicator.belongsTo(models.Activity, { foreignKey: 'activityId' });
    ActivityIndicator.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
  };

  // CRUD operations for this model

  ActivityIndicator.createActivityIndicator = async ({ activityId, challengeId }) => {
    return ActivityIndicator.create({ activityId, challengeId });
  };

  ActivityIndicator.bulkCreateActivityIndicators = async (activityIndicators: [{ activityId: string, challengeId: string }]) => {
    return ActivityIndicator.bulkCreate(activityIndicators);
  };

  return ActivityIndicator;
}
