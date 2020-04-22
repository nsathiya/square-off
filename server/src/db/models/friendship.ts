import * as Sequelize from 'sequelize';
import { FriendStatus } from '../../lib/constants';

interface FriendshipAttributes {
  id?: string;
  user: string;
  friend: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

type FriendshipInstance = Sequelize.Instance<FriendshipAttributes> & FriendshipAttributes;

export function initFriendship(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<FriendshipAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    user: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    friend: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.ENUM(Object.values(FriendStatus)),
      allowNull: false,
      defaultValue: FriendStatus.PENDING,
    },
  };
  const Friendship = sequelize.define<FriendshipInstance, FriendshipAttributes>('Friendships', attributes);

  Friendship.associate = (models) => {
    Friendship.belongsTo(models.User, { as: 'seeker', foreignKey: 'user' });
    Friendship.belongsTo(models.User, { as: 'target', foreignKey: 'friend' });
  };

  // CRUD operations for this model

  Friendship.createFriendship = async ({
    user,
    friend,
    status,
  }) => {
    return Friendship.create({ user, friend, status });
  };

  // Not needed currently
  // Friendship.getFriendshipById = (id) => {
  //   return Friendship.findByPk(id);
  // }
  return Friendship;
}
