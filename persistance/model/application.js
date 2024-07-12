'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Application extends Model {
    static associate(models) {
      // define association here
    }
  }

  Application.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    packageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: "Application",
    timestamps: true
  });

  Application.associate = models => {
    Application.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Application;
};
