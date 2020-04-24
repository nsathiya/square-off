import * as Sequelize from 'sequelize';
import { Exercise, ExerciseMetric, ChallengeStatus } from '../../lib/constants';
import * as moment from 'moment';

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

interface ChallengeAttributes {
  id?: string;
  name: string;
  exercise: string;
  metric: string;
  status: string;
  start_time: number;
  end_time: number;
  createdAt?: string;
  updatedAt?: string;
}

type ChallengeInstance = Sequelize.Instance<ChallengeAttributes> & ChallengeAttributes;

export function initChallenge(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ChallengeInstance> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    exercise: {
      type: Sequelize.ENUM(Object.values(Exercise)),
      allowNull: false,
    },
    metric: {
      type: Sequelize.ENUM(Object.values(ExerciseMetric)),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM(Object.values(ChallengeStatus)),
      allowNull: false,
      defaultValue: ChallengeStatus.HAVE_NOT_STARTED,
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function() {
          const rawValue = this.getDataValue('start_time');
          return moment(rawValue).format(timeFormat);
      }
    },
    end_time: {
      type: Sequelize.DATE,
      allowNull: false,
      get: function() {
          const rawValue = this.getDataValue('end_time');
          return moment(rawValue).format(timeFormat);
      }
    },
  };
  const Challenge = sequelize.define<ChallengeInstance, ChallengeAttributes>('Challenges', attributes);

  Challenge.associate = (models) => {

  };

  // CRUD operations for this model

  Challenge.createChallenge = async ({
    name,
    exercise,
    metric,
    status,
    start_time,
    end_time,
  }: ChallengeAttributes) => {
    return Challenge.create({
      name,
      exercise,
      metric,
      status,
      start_time,
      end_time,
    });
  };

  Challenge.editChallenge = async (id: string, updates: {
    name?: string;
    exercise?: string;
    metric?: string;
    status?: string;
    start_time?: string;
    end_time?: string;
  }) => {
    return Challenge.update(updates, { where: { id }});
  };

  Challenge.getById = (id: string) => {
    return Challenge.findByPk(id);
  };

  return Challenge;
}
