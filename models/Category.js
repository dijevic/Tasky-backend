const { DataTypes } = require("sequelize");
const sequelize = require("../DB/db.config")

const Category = sequelize.define('Category', {
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
    category_user_id: {
        type: DataTypes.INTEGER,
        get() {
            let rawValue = this.getDataValue('user_id');
            return rawValue = undefined;
        }
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    }






}, {
    tableName: `categories`,
    timestamps: false,


}
)






module.exports = Category