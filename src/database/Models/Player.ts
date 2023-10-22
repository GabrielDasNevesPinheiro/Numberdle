import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../Connection";

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {

    declare userId: string;
    declare username: string;
    declare score: CreationOptional<number>;
    declare lastPlayed: CreationOptional<Date>;
    declare multiplier: number;
    declare buffs: CreationOptional<number[]>;
    declare store: CreationOptional<number[]>;
}

Player.init({
    userId: {
        type: new DataTypes.STRING(24),
        primaryKey: true,
    },
    username: {
        type: new DataTypes.STRING(24),
    },
    lastPlayed: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    score: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    multiplier: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0
    },
    buffs: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        defaultValue: []
    },
    store: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        defaultValue: []
    }
}, {
    sequelize,
    tableName: "players"
});

export default Player;