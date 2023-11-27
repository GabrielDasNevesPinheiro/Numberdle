import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../Connection";

class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {

    declare userId: string;
    declare username: string;
    declare score: CreationOptional<number>;
    declare lastPlayed: CreationOptional<Date>;
    declare multiplier: number;
    declare description: string;
    declare buffs: CreationOptional<Array<number>>;
    declare store: CreationOptional<Array<number>>;
    declare storeDate: CreationOptional<Date>;
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
        defaultValue: null,
    },
    score: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    },
    multiplier: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0
    },
    description: {
        type: new DataTypes.STRING(80),
        defaultValue: "Descrição não definida"
    },
    buffs: {
        type: DataTypes.JSON(),
        defaultValue: []
    },
    store: {
        type: DataTypes.JSON(),
        defaultValue: []
    },
    storeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    tableName: "players"
});

export default Player;