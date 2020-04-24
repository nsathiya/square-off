import * as Sequelize from 'sequelize';
import { ScorecardStatus } from '../../lib/constants';

interface ScorecardAttributes {
  id?: string;
  userId: string;
  challengeId: string;
  status: string;
  data: object;
  createdAt?: string;
  updatedAt?: string;
}

type ScorecardInstance = Sequelize.Instance<ScorecardAttributes> & ScorecardAttributes;

export function initScorecard(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<ScorecardAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
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
    status: {
      type: Sequelize.ENUM(Object.values(ScorecardStatus)),
      allowNull: false,
      defaultValue: ScorecardStatus.ACCEPTED,
    },
    data: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: { activities: {} },
    }
  };
  const Scorecard = sequelize.define<ScorecardInstance, ScorecardAttributes>('Scorecards', attributes);

  Scorecard.associate = (models) => {
    Scorecard.belongsTo(models.User, { foreignKey: 'userId' });
    Scorecard.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
  };

  // CRUD operations for this model

  Scorecard.createScorecard = async ({
    userId,
    challengeId,
    status,
    data,
  }) => {
    return Scorecard.create({ userId, challengeId, status, data });
  };

  return Scorecard;
}
