const { DataTypes } = require("sequelize");
const sequelize = require("../DB/db.config")

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        get() {
            let rawValue = this.getDataValue('id');
            return rawValue = undefined;
        }

    },
    user_id: {
        type: DataTypes.INTEGER,
        get() {
            let rawValue = this.getDataValue('user_id');
            return rawValue = undefined;
        }
    },
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false

    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    creationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },





}, {
    tableName: `todos`,
    timestamps: false,


}
)






module.exports = Task