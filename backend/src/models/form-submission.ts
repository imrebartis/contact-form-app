'use strict';

import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../util/db';

class FormSubmission extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public message!: string;
  public queryType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FormSubmission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    queryType: {
      type: DataTypes.ENUM('general', 'support'),
      allowNull: false,
      defaultValue: 'general',
      validate: {
        isIn: [['general', 'support']],
      },
    },
  },
  {
    sequelize,
    tableName: 'form_submissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default FormSubmission;
