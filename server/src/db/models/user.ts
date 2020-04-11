import * as Sequelize from "sequelize";

interface UserAttributes {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  phone_number: number;
  createdAt?: string;
  updatedAt?: string;
}

type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;

export function initUser(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
  };
  const User = sequelize.define<UserInstance, UserAttributes>("User", attributes);
  User.associate = (models) => {
    // User.belongsToMany(models.User, { through: models.Friendship, as: 'Friends' });
  }
  // CRUD operations for this model

  User.createUser = async ({
    userId,
    firstName,
    lastName,
    email,
    phoneNumber
  }) => {
    return User.create({
       user_id: userId,
       first_name: firstName,
       last_name: lastName,
       email: email,
       phone_number: phoneNumber
    });
  }

  User.getUserById = async (id) => {
    return User.findByPk(id);
  }

  return User;
};
