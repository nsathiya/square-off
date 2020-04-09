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
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    first_name: { type: Sequelize.STRING, allowNull: false },
    last_name: { type: Sequelize.STRING, allowNull: false },
    email: { type: Sequelize.STRING, allowNull: false },
    phone_number: { type: Sequelize.NUMBER, allowNull: false },
  };
  const User = sequelize.define<UserInstance, UserAttributes>("User", attributes);
  return User;
};
