const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Application = sequelize.define('Application', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    packageName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    version: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    versionCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    filePath: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
});

// Define associations
Application.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Application, { foreignKey: 'userId', as: 'applications' });

module.exports = Application;
