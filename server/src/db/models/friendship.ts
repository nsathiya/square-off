import * as Sequelize from "sequelize";
import { FriendshipStatus } from "../../lib/constants";

interface FriendshipAttributes {
  id?: string;
  user_from: string;
  user_to: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

type FriendshipInstance = Sequelize.Instance<FriendshipAttributes> & FriendshipAttributes;
// type UserModel = Sequelize.Model<UserInstance, UserAttributes>;

export function initFriendship(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<FriendshipAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    user_from: {
      type: Sequelize.UUID,
      allowNull: false
    },
    user_to: {
      type: Sequelize.UUID,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUMS,
      allowNull: false,
      values: Object.values(FriendshipStatus),
    },
  };
  const Friendship = sequelize.define<FriendshipInstance, FriendshipAttributes>("Friendship", attributes);

  // CRUD operations for this model

  Friendship.createFriendship = async ({
    userTo,
    userFrom,
    status,
  }) => {
    return Friendship.create({
       user_to: userTo,
       user_from: userFrom,
       status: status,
    });
  }

  Friendship.getFriendshipById = (id) => {
    return Friendship.findByPk(id);
  }

  Friendship.getFriendshipsByUser = (userId) => {
    return Friendship.findAll({
      where: {
        OR: [user_to: userId, user_from: userId]
      }
    })
  }

  return Friendship;
};
