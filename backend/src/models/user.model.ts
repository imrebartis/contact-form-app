'use strict';

import { DataTypes, Model } from 'sequelize';

import { IUser } from '../types/user';
import { sequelize } from '../util/db';

interface UserCreationAttributes {
  email?: string;
  name?: string;
  githubId?: string;
  isAdmin?: boolean;
}

class User extends Model<IUser, UserCreationAttributes> {
  declare id: string;
  declare email?: string;
  declare name?: string;
  declare githubId?: string;
  declare isAdmin: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;
