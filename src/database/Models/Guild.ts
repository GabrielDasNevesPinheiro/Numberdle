import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from 'sequelize';
import sequelize from '../Connection';

class Guild extends Model<InferAttributes<Guild>, InferCreationAttributes<Guild>> {

    declare guildId: string;
    declare defaultChannel: CreationOptional<string>;
    declare players: CreationOptional<Array<string>>;

}

Guild.init({
    guildId: {
        type: new DataTypes.STRING(24),
        primaryKey: true
    },
    defaultChannel: {
        type: new DataTypes.STRING(24),
    },
    players: {
        type: DataTypes.JSON(),
        defaultValue: [],
        
    }
}, {
    sequelize,
    tableName: "guilds",
});

export default Guild;