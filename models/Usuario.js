const { DataTypes } = require("sequelize");
const sequelize = require("../DB/db.config");




const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            let rawValue = this.getDataValue('id');
            return rawValue = undefined;
        }

    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false

    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            let rawValue = this.getDataValue('password');
            return rawValue = undefined;
        }


    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        get() {
            let rawValue = this.getDataValue('resetToken');
            return rawValue = undefined;
        }
    }




}, {
    tableName: `users`,
    timestamps: false,

}
)





module.exports = User




