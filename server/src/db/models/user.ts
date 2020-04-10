import * as Sequelize from "sequelize";

interface UserAttributes {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number;
  createdAt?: string;
  updatedAt?: string;
}

type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;
// type UserModel = Sequelize.Model<UserInstance, UserAttributes>;

export function initUser(sequelize: Sequelize.Sequelize) {
  const attributes: SequelizeAttributes<UserAttributes> = {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false
    },
  };
  const User = sequelize.define<UserInstance, UserAttributes>("User", attributes);

  // CRUD operations for this model

  User.createUser = async ({
    firstName,
    lastName,
    email,
    phoneNumber
  }) => {
    return User.create({
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
