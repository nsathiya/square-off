import * as Sequelize from 'sequelize';
import * as moment from 'moment';
import { ScorecardStatus, DistanceMetric, Exercise } from '../../lib/constants';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

interface ActivityAttributes {
  id: string;
  name: string;
  distance: number;
  distanceMetric?: string;
  time: number; // in seconds
  caloriesBurned?: number;
  exercise: string;
  userId: string;
  startTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityInstance = Sequelize.Instance<ActivityAttributes> & ActivityAttributes;

export function initActivity(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ActivityAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
    },
    distance: {
      type: Sequelize.FLOAT,
    },
    distanceMetric: {
      type: Sequelize.ENUM(Object.values(DistanceMetric)),
    },
    time: {
      type: Sequelize.FLOAT,
    },
    caloriesBurned: {
      type: Sequelize.FLOAT,
    },
    exercise: {
      type: Sequelize.ENUM(Object.values(Exercise))
    },
    startTime: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function() {
          const rawValue = this.getDataValue('startTime');
          return moment(rawValue).format(timeFormat);
      }
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  };
  const Activity = sequelize.define<ActivityInstance, ActivityAttributes>('Activities', attributes);

  Activity.associate = (models) => {
    Activity.hasMany(models.ActivityIndicator, { foreignKey: 'activityId' });
    Activity.belongsTo(models.User, { foreignKey: 'userId' });
  };

  // CRUD operations for this model

  Activity.createActivity = async ({
    name,
    distance,
    distanceMetric,
    time,
    caloriesBurned,
    exercise,
    userId,
    startTime,
  }) => {
    return Activity.create({
      name,
      distance,
      distanceMetric,
      time,
      caloriesBurned,
      exercise,
      userId,
      startTime,
    });
  };

  Activity.getById = async (id: string) => {
    return Activity.findByPk(id);
  };

  return Activity;
}
