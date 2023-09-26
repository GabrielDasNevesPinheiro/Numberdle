import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../Connection";

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {

    declare userId: string;
    declare score: CreationOptional<number>;
    declare lastPlayed: CreationOptional<Date>;
}

Player.init({
    userId: {
        type: new DataTypes.STRING(24),
        primaryKey: true,
    },
    lastPlayed: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    score: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    }
}, {
    sequelize,
    tableName: "players"
});

export default Player;