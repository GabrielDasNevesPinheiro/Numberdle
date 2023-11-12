import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from '../Connection';

class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {

    declare id: number;
    declare date: Date;
    declare userId: string;
    declare win: boolean;
    declare buffs: Array<Number>;
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
        allowNull: false
    },
    win: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    buffs: {
        type: DataTypes.JSON(),
        defaultValue: []
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: "games"
});

export default Game;