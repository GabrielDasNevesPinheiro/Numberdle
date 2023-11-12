import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from '../Connection';

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {

    declare id: number;
    declare date: Date;
    declare userId: string;
    declare attempts: number; // used attempts
    declare multiplier: number; // multiplier after game result
    declare score: number; // score after game result
    declare earned: number; // earned points in this game
    declare win: boolean;
    declare buffs: Array<Number>; // used buffs in this game
    declare guildId: string;

}

Game.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
    },
    userId: {
        type: new DataTypes.STRING(24),
        allowNull: false,
    },
    attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    earned: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    multiplier: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    win: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    buffs: {
        type: DataTypes.JSON(),
        defaultValue: [],
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: "games"
});

export default Game;